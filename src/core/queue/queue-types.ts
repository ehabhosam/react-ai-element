import { GenerationConfig } from "../../types";

/**
 * Represents a queued render request for an AIElement
 */
export interface RenderRequest {
    /** Unique identifier for this request */
    id: string;
    /** The user's prompt for component generation */
    prompt: string;
    /** Generation config */
    config: GenerationConfig;
    /** Props to pass to the generated component */
    aiElementProps: Record<string, any>;
    /** Resolve the promise with generated code */
    resolve: (code: string) => void;
    /** Reject the promise with an error */
    reject: (error: Error) => void;
    /** Timestamp when request was queued */
    queuedAt: number;
}

/**
 * Configuration for the queue and worker pool
 */
export interface QueueConfig {
    /** Maximum number of concurrent render operations */
    maxParallelRenders: number;
}

/**
 * Status of a worker in the pool
 */
export interface WorkerStatus {
    id: number;
    busy: boolean;
    currentRequestId: string | null;
}
