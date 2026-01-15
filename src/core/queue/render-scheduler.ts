import AIModel from "../ai/ai-model";
import { GenerationConfig } from "../../types";
import { QueueManager } from "./queue-manager";
import { WorkerPool } from "./worker-pool";
import { RenderRequest, QueueConfig } from "./queue-types";

/**
 * Generate a unique ID for render requests
 */
const generateRequestId = (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Render Scheduler - Main coordinator for the FIFO render queue.
 * 
 * This singleton manages the queue of pending render requests and
 * distributes them to the worker pool for processing.
 * 
 * Usage:
 * 1. Initialize with config and AI model via createAIElement
 * 2. Call scheduleRender() for each AIElement that needs generation
 * 3. Each AIElement receives its result when processing completes
 */
class RenderScheduler {
    private static instance: RenderScheduler | null = null;

    private queue: QueueManager;
    private workerPool: WorkerPool;
    private isProcessing: boolean = false;
    private initialized: boolean = false;

    private constructor() {
        this.queue = new QueueManager();
        this.workerPool = new WorkerPool();

        // Set up queue callback to trigger processing
        this.queue.setOnItemQueued(() => {
            this.processQueue();
        });
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): RenderScheduler {
        if (!RenderScheduler.instance) {
            RenderScheduler.instance = new RenderScheduler();
        }
        return RenderScheduler.instance;
    }

    /**
     * Initialize the scheduler with configuration and AI model.
     * Called once during createAIElement.
     */
    initialize(
        config: QueueConfig,
        aiModel: AIModel<any>,
    ): void {
        // Only initialize once with first config
        // Subsequent calls are ignored (first AIElement config wins)
        if (this.initialized) {
            return;
        }

        this.workerPool.initialize(config.maxParallelRenders, aiModel);
        this.initialized = true;
    }

    /**
     * Schedule a render request for an AIElement.
     * Returns a promise that resolves with the generated code.
     */
    scheduleRender(
        prompt: string,
        config: GenerationConfig,
        aiElementProps: Record<string, any> = {},
    ): Promise<string> {
        if (!this.initialized) {
            return Promise.reject(
                new Error("RenderScheduler not initialized. Call initialize() first."),
            );
        }

        return new Promise((resolve, reject) => {
            const request: RenderRequest = {
                id: generateRequestId(),
                prompt,
                config,
                aiElementProps,
                resolve,
                reject,
                queuedAt: Date.now(),
            };

            // Add to queue (will trigger processQueue via callback)
            this.queue.enqueue(request);
        });
    }

    /**
     * Process queued requests when workers are available.
     * This is the main queue iterator.
     */
    private processQueue(): void {
        // Prevent concurrent processing loops
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        // Process as many items as we have idle workers
        while (!this.queue.isEmpty() && this.workerPool.hasIdleWorker()) {
            const request = this.queue.dequeue();

            if (request) {
                // Execute request on worker
                // The onComplete callback will trigger more processing
                this.workerPool.executeRequest(request, () => {
                    // When a worker finishes, try to process more from queue
                    this.processQueue();
                });
            }
        }

        this.isProcessing = false;
    }

    /**
     * Get current queue size (for debugging/monitoring)
     */
    getQueueSize(): number {
        return this.queue.size();
    }

    /**
     * Get active worker count (for debugging/monitoring)
     */
    getActiveWorkerCount(): number {
        return this.workerPool.getActiveCount();
    }

    /**
     * Check if scheduler is initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Reset the scheduler (mainly for testing)
     */
    reset(): void {
        this.queue.clear();
        this.workerPool.destroy();
        this.initialized = false;
        this.isProcessing = false;
    }

    /**
     * Destroy the singleton instance (mainly for testing)
     */
    static destroyInstance(): void {
        if (RenderScheduler.instance) {
            RenderScheduler.instance.reset();
            RenderScheduler.instance = null;
        }
    }
}

// Export singleton instance
export const renderScheduler = RenderScheduler.getInstance();

// Export class for testing
export { RenderScheduler };
