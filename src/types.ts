export interface ParsedImport {
  localVars: Record<string, any>;
  sanitizedCode: string;
}

export interface GenerationConfig {
  preset: "ts" | "js";
  tailwind: boolean;
  libraries?: Record<string, any>;
}
