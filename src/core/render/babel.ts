import * as Babel from "@babel/standalone";

// Pure function to transform code with Babel
export const transformCode = (code: string, preset: "js" | "ts"): string => {
  const presets = preset === "ts" ? ["react", "typescript"] : ["react"];

  const transformed = Babel.transform(code, {
    filename: "DynamicComponent.tsx",
    presets,
  }).code;

  if (!transformed) {
    throw new Error("Babel transform failed.");
  }

  return transformed;
};
