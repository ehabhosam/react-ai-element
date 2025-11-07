import * as Babel from "@babel/standalone";

// Pure function to transform code with Babel
export const transformCode = (code: string): string => {
  const transformed = Babel.transform(code, {
    filename: "DynamicComponent.tsx",
    presets: ["react", "typescript"],
  }).code;

  if (!transformed) {
    throw new Error("Babel transform failed.");
  }

  return transformed;
};
