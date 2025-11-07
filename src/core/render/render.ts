import React from "react";
import { transformCode } from "./babel";
import { createImportMap, parseImports, removeExportDefault } from "./imports";

// create component scope
const createScope = (localVars: Record<string, any>): Record<string, any> => ({
  React,
  ...localVars,
});

// evaluate component from provided code (transformed by Babel)
const evaluateComponent = (
  transformedCode: string,
  scope: Record<string, any>,
): React.ComponentType => {
  // eslint-disable-next-line no-new-func
  const Comp = new Function(
    ...Object.keys(scope),
    `"use strict"; return (${transformedCode});`,
  )(...Object.values(scope));

  if (typeof Comp !== "function" && typeof Comp !== "object") {
    throw new Error("Provided code did not export a React component.");
  }

  return Comp;
};

// Main compilation function
const compileComponent = (
  code: string,
  imports: Record<string, any>,
): React.ComponentType | Error => {
  try {
    const importMap = createImportMap(imports);
    const { localVars, sanitizedCode } = parseImports(code, importMap);
    const withoutExports = removeExportDefault(sanitizedCode);
    const transformed = transformCode(withoutExports);
    const scope = createScope(localVars);

    return evaluateComponent(transformed, scope);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export { compileComponent };
