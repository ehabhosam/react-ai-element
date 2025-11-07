export interface ParsedImport {
  localVars: Record<string, any>;
  sanitizedCode: string;
}

export interface GenerationConfig {
  preset: "ts" | "js";
  tailwind: boolean;
  uiComponentLibrary?:
    | "material-ui"
    | "chakra-ui"
    | "ant-design"
    | "bootstrap"
    | "semantic-ui"
    | "none";
  iconsLibrary?:
    | "react-icons"
    | "material-icons"
    | "font-awesome"
    | "heroicons"
    | "none";
}
