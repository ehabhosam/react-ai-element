import AIModel from "../ai/ai-model";
import { RenderRequest, WorkerStatus } from "./queue-types";
import { generateUIPrompt } from "../prompts";

/**
 * Worker Pool Manager.
 * Manages a pool of "virtual workers" that process AI generation requests.
 * 
 * Note: Due to browser limitations with AI SDKs in Web Workers,
 * this uses a virtual worker pattern where workers are represented
 * as slots that limit concurrent operations on the main thread.
 */
class WorkerPool {
    private workers: WorkerStatus[] = [];
    private aiModel: AIModel<any> | null = null;

    /**
     * Initialize the worker pool
     */
    initialize(maxWorkers: number, aiModel: AIModel<any>): void {
        this.aiModel = aiModel;

        // Create worker status slots
        this.workers = [];
        for (let i = 0; i < maxWorkers; i++) {
            this.workers.push({
                id: i,
                busy: false,
                currentRequestId: null,
            });
        }
    }

    /**
     * Get an idle worker, or undefined if all are busy
     */
    getIdleWorker(): WorkerStatus | undefined {
        return this.workers.find((w) => !w.busy);
    }

    /**
     * Check if any worker is available
     */
    hasIdleWorker(): boolean {
        return this.workers.some((w) => !w.busy);
    }

    /**
     * Get the number of currently active workers
     */
    getActiveCount(): number {
        return this.workers.filter((w) => w.busy).length;
    }

    /**
     * Execute a render request using an available worker
     * Returns a promise that resolves when the work is complete
     */
    async executeRequest(
        request: RenderRequest,
        onComplete: () => void,
    ): Promise<void> {
        const worker = this.getIdleWorker();

        if (!worker) {
            throw new Error("No idle worker available");
        }

        if (!this.aiModel) {
            throw new Error("Worker pool not initialized");
        }

        // Mark worker as busy
        worker.busy = true;
        worker.currentRequestId = request.id;

        try {
            // Generate the prompt
            const generationPrompt = generateUIPrompt(
                request.prompt,
                request.config,
                request.aiElementProps,
            );

            // Call the AI model
            const code = await this.aiModel.generateResponse(generationPrompt);

            // Resolve the request promise
            request.resolve(code);
        } catch (error) {
            // Reject the request promise
            request.reject(
                error instanceof Error ? error : new Error(String(error)),
            );
        } finally {
            // Mark worker as idle
            worker.busy = false;
            worker.currentRequestId = null;

            // Notify that worker is available
            onComplete();
        }
    }

    /**
     * Get status of all workers
     */
    getStatus(): WorkerStatus[] {
        return [...this.workers];
    }

    /**
     * Cleanup and release resources
     */
    destroy(): void {
        this.workers = [];
        this.aiModel = null;
    }
}

export { WorkerPool };
