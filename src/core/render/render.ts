import React from "react";
import { transformCode } from "./babel";
import {
  createImportMap,
  parseImports,
  removeCodeBlockMarkers,
  removeExportDefault,
} from "./imports";

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
  // Extract component name from the code (assumes format: const ComponentName = ...)
  const componentNameMatch = transformedCode.match(/const\s+(\w+)\s*[=:]/);
  const componentName = componentNameMatch ? componentNameMatch[1] : null;

  if (!componentName) {
    throw new Error("Could not extract component name from code");
  }

  // eslint-disable-next-line no-new-func
  const result = new Function(
    ...Object.keys(scope),
    `"use strict";
     ${transformedCode}
     return ${componentName};`,
  )(...Object.values(scope));

  if (typeof result !== "function" && typeof result !== "object") {
    throw new Error("Provided code did not export a React component.");
  }

  return result;
};

// Main compilation function
const compileComponent = (
  code: string,
  imports: Record<string, any>,
  preset: "ts" | "js",
): React.ComponentType | Error => {
  try {
    const importMap = createImportMap(imports);
    const withoutCodeBlockMarkers = removeCodeBlockMarkers(code);
    console.log("withoutCodeBlockMarkers", withoutCodeBlockMarkers);
    const { localVars, sanitizedCode } = parseImports(
      withoutCodeBlockMarkers,
      importMap,
    );
    const withoutExports = removeExportDefault(sanitizedCode);
    console.log("withoutExports", withoutExports);
    const transformed = transformCode(withoutExports, preset);
    console.log("transformed", transformed);
    const scope = createScope(localVars);

    return evaluateComponent(transformed, scope);
  } catch (err) {
    return err instanceof Error ? err : new Error(String(err));
  }
};

export { compileComponent };
