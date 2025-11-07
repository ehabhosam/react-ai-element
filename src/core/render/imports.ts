import React from "react";
import { ParsedImport } from "../../types";

// Pure function to create import map
const createImportMap = (
  imports: Record<string, any>,
): Record<string, any> => ({
  react: React,
  ...imports,
});

// Pure function to parse named imports
const parseNamedImports = (
  importedItems: string,
  importedModule: any,
): Record<string, any> => {
  const names = importedItems
    .replace(/[{}]/g, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const localVars: Record<string, any> = {};
  for (const name of names) {
    const [orig, alias] = name.split(/\s+as\s+/);
    localVars[alias || orig] =
      importedModule[orig as keyof typeof importedModule];
  }
  return localVars;
};

// Pure function to parse default import
const parseDefaultImport = (
  importedItems: string,
  importedModule: any,
): Record<string, any> => ({
  [importedItems.trim()]: importedModule,
});

// Pure function to parse all import statements
const parseImports = (
  code: string,
  importMap: Record<string, any>,
): ParsedImport => {
  const importRegex = /import\s+([\s\S]+?)\s+from\s+['"](.+?)['"];?/g;
  let match: RegExpExecArray | null;
  const localVars: Record<string, any> = {};
  let sanitized = code;

  while ((match = importRegex.exec(code))) {
    const [fullMatch, importedItems, moduleName] = match;

    const importedModule = importMap[moduleName];

    if (!importedModule) {
      console.warn(`⚠️ Unknown import: "${moduleName}" — skipping.`);
      sanitized = sanitized.replace(fullMatch, "");
      continue;
    }

    // Handle mixed imports: "React, { useState }" or "React, {useState}" etc.
    let parsedVars: Record<string, any> = {};

    if (importedItems.includes(",")) {
      // Mixed import: default + named
      const parts = importedItems.split(",");
      const defaultPart = parts[0].trim();
      const namedPart = parts.slice(1).join(",").trim();

      // Parse default import
      if (defaultPart) {
        const defaultVars = parseDefaultImport(defaultPart, importedModule);
        Object.assign(parsedVars, defaultVars);
      }

      // Parse named imports
      if (namedPart) {
        const namedVars = parseNamedImports(namedPart, importedModule);
        Object.assign(parsedVars, namedVars);
      }
    } else if (importedItems.startsWith("{")) {
      // Only named imports
      parsedVars = parseNamedImports(importedItems, importedModule);
    } else {
      // Only default import
      parsedVars = parseDefaultImport(importedItems, importedModule);
    }

    Object.assign(localVars, parsedVars);
    sanitized = sanitized.replace(fullMatch, "");
  }

  return { localVars, sanitizedCode: sanitized };
};

// Pure function to remove export default
const removeExportDefault = (code: string): string =>
  code.replace(/export\s+default\s+/, "");

// Pure function to remove code block markers
const removeCodeBlockMarkers = (code: string): string =>
  code
    .replace(/^```(?:tsx?|jsx?|javascript|typescript)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "");

export {
  createImportMap,
  parseImports,
  removeExportDefault,
  removeCodeBlockMarkers,
};
