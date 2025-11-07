import React from "react";
import { ParsedImport } from "./types";

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

    const parsedVars = importedItems.startsWith("{")
      ? parseNamedImports(importedItems, importedModule)
      : parseDefaultImport(importedItems, importedModule);

    Object.assign(localVars, parsedVars);
    sanitized = sanitized.replace(fullMatch, "");
  }

  return { localVars, sanitizedCode: sanitized };
};

// Pure function to remove export default
const removeExportDefault = (code: string): string =>
  code.replace(/export\s+default\s+/, "");

export { createImportMap, parseImports, removeExportDefault };
