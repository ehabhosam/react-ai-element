export interface ParsedImport {
  localVars: Record<string, any>;
  sanitizedCode: string;
}

export interface GenerationConfig {
  preset: "ts" | "js";
  tailwind: boolean;
  libraries?: Record<string, any>;
  /**
   * Maximum number of AIElements that can render in parallel.
   * Higher values may improve throughput but increase memory usage.
   * @default 3
   */
  max_parallel_renders?: number;
}
