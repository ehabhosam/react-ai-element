import { RenderRequest } from "./queue-types";

/**
 * FIFO Queue Manager for render requests.
 * Manages ordering and ensures requests are processed in the order they were received.
 */
class QueueManager {
    private queue: RenderRequest[] = [];
    private onItemQueued: (() => void) | null = null;

    /**
     * Add a request to the end of the queue
     */
    enqueue(request: RenderRequest): void {
        this.queue.push(request);
        // Notify listener that new item is available
        if (this.onItemQueued) {
            this.onItemQueued();
        }
    }

    /**
     * Remove and return the first request from the queue
     */
    dequeue(): RenderRequest | undefined {
        return this.queue.shift();
    }

    /**
     * Peek at the first request without removing it
     */
    peek(): RenderRequest | undefined {
        return this.queue[0];
    }

    /**
     * Check if queue is empty
     */
    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    /**
     * Get current queue size
     */
    size(): number {
        return this.queue.length;
    }

    /**
     * Set callback for when items are queued
     */
    setOnItemQueued(callback: () => void): void {
        this.onItemQueued = callback;
    }

    /**
     * Clear all pending requests (for cleanup)
     */
    clear(): void {
        // Reject all pending requests
        for (const request of this.queue) {
            request.reject(new Error("Queue cleared"));
        }
        this.queue = [];
    }
}

export { QueueManager };
