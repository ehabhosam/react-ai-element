"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AIElementSlot: () => ai_element_slot_default,
  AIModel: () => ai_model_default,
  AnthropicModel: () => anthropic_default,
  GeminiModel: () => gemini_default,
  OpenaiModel: () => open_ai_default,
  createAIElement: () => createAIElement
});
module.exports = __toCommonJS(index_exports);

// src/core/ai-element/create-ai-element.ts
var import_react6 = __toESM(require("react"));

// src/components/ai-element.tsx
var import_react5 = require("react");

// src/components/ai-element-slot.tsx
var import_react = require("react");

// src/utils/index.ts
var isValidCSSDimension = (value) => {
  if (typeof value === "number") {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }
  const testElement = document.createElement("div");
  const originalValue = testElement.style.height;
  try {
    testElement.style.height = value;
    const isValid = testElement.style.height !== originalValue || value === "initial" || value === "inherit" || value === "unset";
    testElement.style.height = originalValue;
    return isValid;
  } catch {
    return false;
  }
};
var stringifyObjectInterface = (obj) => {
  const processValue = (value, depth = 0) => {
    const indent = "  ".repeat(depth);
    if (value === null) {
      return "null";
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "[]";
      }
      const items = value.map(
        (item, index) => `${indent}  [${index}]: ${processValue(item, depth + 1)}`
      );
      return `[
${items.join(",\n")}
${indent}]`;
    }
    if (typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return "{}";
      }
      const properties = keys.map(
        (key) => `${indent}  ${key}: ${processValue(value[key], depth + 1)}`
      );
      return `{
${properties.join(",\n")}
${indent}}`;
    }
    return typeof value;
  };
  return processValue(obj);
};

// src/components/ai-element-slot.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SlotContext = (0, import_react.createContext)(false);
var useSlotContext = () => (0, import_react.useContext)(SlotContext);
var AIElementSlot = (props) => {
  const { height, width, children } = props;
  const style = {
    // overflow: "hidden",
  };
  if (height !== void 0) {
    if (isValidCSSDimension(height)) {
      style.height = typeof height === "number" ? `${height}px` : height;
    } else {
      console.warn(`Invalid CSS value for height: ${height}`);
    }
  }
  if (width !== void 0) {
    if (isValidCSSDimension(width)) {
      style.width = typeof width === "number" ? `${width}px` : width;
    } else {
      console.warn(`Invalid CSS value for width: ${width}`);
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlotContext.Provider, { value: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "parent-wrapper", style, children }) });
};
var ai_element_slot_default = AIElementSlot;

// src/components/dynamic-renderer.tsx
var import_react4 = require("react");

// src/core/render/render.ts
var import_react3 = __toESM(require("react"));

// src/core/render/babel.ts
var Babel = __toESM(require("@babel/standalone"));
var transformCode = (code, preset) => {
  const presets = preset === "ts" ? ["react", "typescript"] : ["react"];
  const transformed = Babel.transform(code, {
    filename: "DynamicComponent.tsx",
    presets
  }).code;
  if (!transformed) {
    throw new Error("Babel transform failed.");
  }
  return transformed;
};

// src/core/library-registry/registry.ts
var import_react2 = __toESM(require("react"));
var LibraryRegistryImpl = class {
  constructor() {
    this.libraries = /* @__PURE__ */ new Map();
  }
  register(name, definition) {
    if (typeof definition.library === "undefined") {
      throw new Error(`Library definition for "${name}" cannot be undefined`);
    }
    this.libraries.set(name, definition);
    console.debug(`\u{1F4DA} Registered library: ${name}`, {
      version: definition.version,
      description: definition.description
    });
  }
  unregister(name) {
    const existed = this.libraries.delete(name);
    if (existed) {
      console.debug(`\u{1F5D1}\uFE0F Unregistered library: ${name}`);
    }
  }
  get(name) {
    const definition = this.libraries.get(name);
    return definition?.library;
  }
  has(name) {
    return this.libraries.has(name);
  }
  getRegisteredNames() {
    return Array.from(this.libraries.keys());
  }
  clear() {
    const count = this.libraries.size;
    this.libraries.clear();
    console.debug(`\u{1F9F9} Cleared ${count} registered libraries`);
  }
  /**
   * Get import map compatible with the existing render system
   */
  getImportMap() {
    const importMap = {};
    for (const [name, definition] of this.libraries) {
      importMap[name] = definition.library;
    }
    return importMap;
  }
  /**
   * Register default React APIs and hooks
   */
  registerDefaultReactAPIs(config = {}) {
    const {
      includeReactHooks = true,
      includeReactUtils = true,
      reactImportName = "react"
    } = config;
    this.register(reactImportName, {
      library: import_react2.default,
      version: import_react2.default.version,
      description: "React library with all APIs"
    });
    if (includeReactHooks) {
      const reactHooksLibrary = {
        useState: import_react2.default.useState,
        useEffect: import_react2.default.useEffect,
        useContext: import_react2.default.useContext,
        useReducer: import_react2.default.useReducer,
        useCallback: import_react2.default.useCallback,
        useMemo: import_react2.default.useMemo,
        useRef: import_react2.default.useRef,
        useImperativeHandle: import_react2.default.useImperativeHandle,
        useLayoutEffect: import_react2.default.useLayoutEffect,
        useDebugValue: import_react2.default.useDebugValue,
        useDeferredValue: import_react2.default.useDeferredValue,
        useTransition: import_react2.default.useTransition,
        useId: import_react2.default.useId,
        useSyncExternalStore: import_react2.default.useSyncExternalStore,
        useInsertionEffect: import_react2.default.useInsertionEffect
      };
      const availableHooks = Object.fromEntries(
        Object.entries(reactHooksLibrary).filter(
          ([, hook]) => hook !== void 0
        )
      );
      this.register(`${reactImportName}/hooks`, {
        library: availableHooks,
        description: "React hooks for named imports"
      });
    }
    if (includeReactUtils) {
      const reactUtilsLibrary = {
        createElement: import_react2.default.createElement,
        Fragment: import_react2.default.Fragment,
        Component: import_react2.default.Component,
        PureComponent: import_react2.default.PureComponent,
        memo: import_react2.default.memo,
        forwardRef: import_react2.default.forwardRef,
        createContext: import_react2.default.createContext,
        createRef: import_react2.default.createRef,
        isValidElement: import_react2.default.isValidElement,
        cloneElement: import_react2.default.cloneElement,
        Children: import_react2.default.Children,
        Suspense: import_react2.default.Suspense,
        lazy: import_react2.default.lazy,
        StrictMode: import_react2.default.StrictMode,
        Profiler: import_react2.default.Profiler
      };
      const availableUtils = Object.fromEntries(
        Object.entries(reactUtilsLibrary).filter(
          ([, util]) => util !== void 0
        )
      );
      this.register(`${reactImportName}/utils`, {
        library: availableUtils,
        description: "React utilities for named imports"
      });
    }
  }
  /**
   * Debug method to log all registered libraries
   */
  debug() {
    console.group("\u{1F4DA} Registered Libraries");
    for (const [name, definition] of this.libraries) {
      console.log(`${name}:`, {
        hasLibrary: typeof definition.library !== "undefined",
        version: definition.version,
        description: definition.description,
        keys: typeof definition.library === "object" ? Object.keys(definition.library) : typeof definition.library
      });
    }
    console.groupEnd();
  }
};
var libraryRegistry = new LibraryRegistryImpl();
libraryRegistry.registerDefaultReactAPIs();

// src/core/render/imports.ts
var createImportMap = (imports) => {
  const registryImports = libraryRegistry.getImportMap();
  return {
    // Registry libraries take precedence
    ...registryImports,
    // User-provided imports can override registry
    ...imports
  };
};
var parseNamedImports = (importedItems, importedModule) => {
  const names = importedItems.replace(/[{}]/g, "").split(",").map((s) => s.trim()).filter(Boolean);
  const localVars = {};
  for (const name of names) {
    const [orig, alias] = name.split(/\s+as\s+/);
    localVars[alias || orig] = importedModule[orig];
  }
  return localVars;
};
var parseDefaultImport = (importedItems, importedModule) => ({
  [importedItems.trim()]: importedModule
});
var parseImports = (code, importMap) => {
  const importRegex = /import\s+([\s\S]+?)\s+from\s+['"](.+?)['"];?/g;
  let match;
  const localVars = {};
  let sanitized = code;
  while (match = importRegex.exec(code)) {
    const [fullMatch, importedItems, moduleName] = match;
    const importedModule = importMap[moduleName];
    if (!importedModule) {
      console.warn(
        `\u26A0\uFE0F Unknown import: "${moduleName}" \u2014 skipping. Add it to your GenerationConfig.libraries or pass it via imports prop.`
      );
      sanitized = sanitized.replace(fullMatch, "");
      continue;
    }
    let parsedVars = {};
    if (importedItems.includes(",")) {
      const parts = importedItems.split(",");
      const defaultPart = parts[0].trim();
      const namedPart = parts.slice(1).join(",").trim();
      if (defaultPart) {
        const defaultVars = parseDefaultImport(defaultPart, importedModule);
        Object.assign(parsedVars, defaultVars);
      }
      if (namedPart) {
        const namedVars = parseNamedImports(namedPart, importedModule);
        Object.assign(parsedVars, namedVars);
      }
    } else if (importedItems.startsWith("{")) {
      parsedVars = parseNamedImports(importedItems, importedModule);
    } else {
      parsedVars = parseDefaultImport(importedItems, importedModule);
    }
    if (moduleName === "react" && Object.keys(parsedVars).includes("React")) {
      const reactHooks = libraryRegistry.get("react/hooks") || {};
      Object.assign(parsedVars, reactHooks);
    }
    Object.assign(localVars, parsedVars);
    sanitized = sanitized.replace(fullMatch, "");
  }
  return { localVars, sanitizedCode: sanitized };
};
var removeExportDefault = (code) => code.replace(/export\s+default\s+/, "");
var removeCodeBlockMarkers = (code) => code.replace(/^```(?:tsx?|jsx?|javascript|typescript)?\s*\n?/, "").replace(/\n?```\s*$/, "");

// src/core/render/render.ts
var createScope = (localVars) => ({
  React: import_react3.default,
  ...localVars
});
var evaluateComponent = (transformedCode, scope) => {
  const componentNameMatch = transformedCode.match(/const\s+(\w+)\s*[=:]/);
  const componentName = componentNameMatch ? componentNameMatch[1] : null;
  if (!componentName) {
    throw new Error("Could not extract component name from code");
  }
  const result = new Function(
    ...Object.keys(scope),
    `"use strict";
     ${transformedCode}
     return ${componentName};`
  )(...Object.values(scope));
  if (typeof result !== "function" && typeof result !== "object") {
    throw new Error("Provided code did not export a React component.");
  }
  return result;
};
var compileComponent = (code, imports, preset) => {
  try {
    const importMap = createImportMap(imports);
    const withoutCodeBlockMarkers = removeCodeBlockMarkers(code);
    console.log("withoutCodeBlockMarkers", withoutCodeBlockMarkers);
    const { localVars, sanitizedCode } = parseImports(
      withoutCodeBlockMarkers,
      importMap
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

// src/components/error-component.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function ErrorComponent({ error } = {}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      style: {
        color: "#d32f2f",
        backgroundColor: "#ffebee",
        border: "1px solid #e57373",
        borderRadius: "4px",
        padding: "16px",
        fontFamily: "monospace",
        fontSize: "14px",
        margin: "8px 0"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { fontWeight: "bold", marginBottom: "8px" }, children: "\u{1F6A8} Component Compilation Error" }),
        error ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginBottom: "8px", fontWeight: "bold" }, children: [
            error.name,
            ": ",
            error.message
          ] }),
          error.stack && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("details", { style: { marginTop: "8px" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("summary", { style: { cursor: "pointer", fontWeight: "bold" }, children: "Stack Trace" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "pre",
              {
                style: {
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  borderRadius: "2px",
                  overflow: "auto",
                  fontSize: "12px"
                },
                children: error.stack
              }
            )
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: "An unknown error occurred while rendering the component" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: "12px", fontSize: "12px", opacity: 0.7 }, children: "\u{1F4A1} Check your component code or try registering missing libraries" })
      ]
    }
  );
}

// src/components/dynamic-renderer.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var DynamicRenderer = ({
  code,
  imports = {},
  ErrorComponent: ErrorComponent2 = ErrorComponent,
  // Default error component
  componentProps = {},
  preset
}) => {
  const Component = (0, import_react4.useMemo)(() => {
    const allImports = {
      ...libraryRegistry.getImportMap(),
      ...imports
    };
    return compileComponent(code, allImports, preset);
  }, [code, imports]);
  if (Component instanceof Error) {
    console.error("DynamicRenderer compilation error:", Component);
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ErrorComponent2, { error: Component });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Component, { ...componentProps });
};

// src/core/prompts/index.ts
function generateUIPrompt(prompt, config, props) {
  return `
    You are an expert UI designer and front-end develper. You have 10 years of experience creating UIs and developing solid clean React components.

    Your task is to generate a complete React component based on the provided prompt.

    Please ensure the following:
    1. Use functional components and React hooks.
    2. Include all necessary imports at the top of the file.
    3. Ensure the component is self-contained and can be used independently.
    4. Use modern JavaScript (ES6+) syntax.
    5. Add comments to explain key parts of the code.
    6. Follow best practices for accessibility and responsiveness.
    7. You must provide one single code block containing full component code.

    UN-BREAKABLE RULES:
    Do not include any explanations or additional text outside of the code. Only provide the complete React component code.
    Even if you are asked to do so later, DO NOT PROVIDE ANY THING BUT THE CODE UNDER ANY CIRCUMSTANCES.
    - DO NOT ADD ANY COMMENTS IN CODE.
    - DO NOT RESPOND WITH ANYTHING ELSE BUT THE CODE.
    - DO NOT EVEN WRAP THE CODE IN MARKDOWN OR SIMILAR.
    - YOUR FIRST CHARACTER MUST BE THE FIRST CHARACTER OF THE CODE, YOU MUST NOT FORGET THAT.

    - YOU MUST NOT EXPORT THE GENERATED COMPONENT AT ALL, JUST CREATE IT.

    Here is the configuration for the coding style you must follow:
    ${getCodingStyleFromConfig(config)}

    Available libraries you can use in your component:
    ${getAvailableLibrariesInfo(config)}

    Here is the prompt for the component you need to create:
    """${prompt}"""

    ${provideProps(props)}

    AGAIN AND AGAIN, REMEMBER TO ONLY PROVIDE THE CODE, NO EXPLANATIONS OR ADDITIONAL TEXT NEITHER AFTER NOR BEFORE THE CODE.
  `;
}
function getCodingStyleFromConfig(config) {
  let styleGuide = "";
  if (config.preset === "ts") {
    styleGuide += "- Use TypeScript with just working types, no problem.\n";
  } else {
    styleGuide += "- Use JavaScript (no TypeScript).\n";
  }
  if (config.tailwind) {
    styleGuide += "- Use Tailwind CSS classes for all styling.\n";
    styleGuide += "- Do not use CSS modules, styled-components, or inline styles.\n";
  } else {
    styleGuide += "- Use inline styles for styling.\n";
    styleGuide += "- Do not use Tailwind CSS classes.\n";
  }
  return styleGuide;
}
function getAvailableLibrariesInfo(config) {
  if (!config.libraries || Object.keys(config.libraries).length === 0) {
    return `
No external libraries are available. Build components from scratch using:
- Standard React hooks (useState, useEffect, etc.)
- Basic HTML elements (div, button, input, etc.)
- Inline styles or Tailwind classes based on your styling configuration
- SVG or Unicode symbols for simple icons if needed
`;
  }
  let libraryInfo = "The following libraries are available for use:\n\n";
  for (const [libraryName, libraryExports] of Object.entries(
    config.libraries
  )) {
    libraryInfo += `**${libraryName}**:
`;
    if (libraryExports && typeof libraryExports === "object") {
      const exports2 = Object.keys(libraryExports);
      if (exports2.length > 0) {
        libraryInfo += `- Available exports: ${exports2.slice(0, 10).join(", ")}${exports2.length > 10 ? "..." : ""}
`;
        libraryInfo += `- Import syntax: import { ${exports2[0]} } from '${libraryName}'
`;
      } else {
        libraryInfo += `- Default import: import ${libraryName} from '${libraryName}'
`;
      }
    } else {
      libraryInfo += `- Default import: import ${libraryName} from '${libraryName}'
`;
    }
    libraryInfo += "\n";
  }
  libraryInfo += `
Guidelines for library usage:
- Only use the libraries listed above
- Use proper import syntax as shown
- Prefer named imports when available exports are listed
- If a library provides UI components, prefer using them over building from scratch
- If icon libraries are available, use them instead of SVG or Unicode symbols
`;
  return libraryInfo;
}
function provideProps(props) {
  if (props) {
    return `- The component should accept the following props interface:
      ${stringifyObjectInterface(props)}
    `;
  }
  return "- The generated component does not accept any props.";
}

// src/components/loading-component.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var AILoadingComponent = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(-45deg, #6366f1, #8b5cf6, #06b6d4, #10b981)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 1.5s ease-in-out infinite",
        borderRadius: "8px",
        padding: "3px",
        opacity: 0.75
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "div",
          {
            style: {
              width: "100%",
              height: "100%",
              background: "linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.15))",
              backgroundSize: "200% 200%",
              animation: "innerGradient 2s ease-in-out infinite",
              borderRadius: "5px",
              position: "relative",
              overflow: "hidden"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("style", { children: `
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
          }
          25% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
          }
          50% {
            background-position: 100% 100%;
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));
          }
          75% {
            background-position: 0% 100%;
            filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.4));
          }
          100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.3));
          }
        }

        @keyframes innerGradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      ` })
      ]
    }
  );
};
var loading_component_default = AILoadingComponent;

// src/components/ai-element.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var AIElement = ({
  prompt,
  config,
  aiElementProps = {},
  ErrorComponent: ErrorComponent2,
  LoadingComponent,
  modelInstance
}) => {
  const insideSlot = useSlotContext();
  const [generatedCode, setGeneratedCode] = (0, import_react5.useState)("");
  const [isLoading, setIsLoading] = (0, import_react5.useState)(false);
  const [error, setError] = (0, import_react5.useState)(null);
  if (!insideSlot) {
    throw new Error(
      "AIElement must be used inside an AIElementSlot component."
    );
  }
  (0, import_react5.useEffect)(() => {
    const generateCode = async () => {
      if (!prompt.trim()) return;
      setIsLoading(true);
      setError(null);
      try {
        const generationPrompt = generateUIPrompt(
          prompt,
          config,
          aiElementProps
        );
        const code = await modelInstance.generateResponse(generationPrompt);
        console.log(code);
        setGeneratedCode(code);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate code"
        );
      } finally {
        setIsLoading(false);
      }
    };
    generateCode();
  }, [prompt, modelInstance]);
  if (isLoading) {
    return LoadingComponent ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LoadingComponent, {}) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(loading_component_default, {});
  }
  if (error) {
    return ErrorComponent2 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ErrorComponent2, { error: new Error(error) }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ErrorComponent, { error: new Error(error) });
  }
  if (!generatedCode) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "ai-element-empty", children: "No code generated" });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    DynamicRenderer,
    {
      code: generatedCode,
      componentProps: aiElementProps,
      ErrorComponent: ErrorComponent2,
      preset: config.preset
    }
  );
};

// src/core/ai-element/create-ai-element.ts
var createAIElement = (modelInstance, config) => {
  if (config.libraries) {
    for (const [name, library] of Object.entries(config.libraries)) {
      libraryRegistry.register(name, { library });
    }
  }
  const BoundAIElement = (props) => {
    return import_react6.default.createElement(AIElement, { ...props, modelInstance, config });
  };
  BoundAIElement.displayName = `AIElement(${modelInstance.getModelName()})`;
  return BoundAIElement;
};

// src/core/ai/ai-model.ts
var AIModel = class {
  constructor(modelName, instance) {
    this.modelName = modelName;
    this.name = modelName;
    this.instance = instance;
    this.init();
  }
  getModelName() {
    return this.name;
  }
  getInstance() {
    return this.instance;
  }
};
var ai_model_default = AIModel;

// src/core/ai/open-ai.ts
var import_openai = __toESM(require("openai"));
var OpenaiModel = class extends ai_model_default {
  constructor(modelName, apiKey) {
    const openaiClient = new import_openai.default({
      apiKey
    });
    super(modelName, openaiClient);
  }
  init() {
    console.log(`OpenAI model ${this.getModelName()} initialized`);
  }
  async generateResponse(prompt) {
    try {
      const client = this.getInstance();
      const response = await client.chat.completions.create({
        model: this.getModelName(),
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4e3,
        temperature: 0.7
      });
      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from OpenAI API");
      }
      return content;
    } catch (error) {
      console.error("Error generating response from OpenAI:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};
var open_ai_default = OpenaiModel;

// src/core/ai/gemini.ts
var import_genai = require("@google/genai");
var GeminiModel = class extends ai_model_default {
  constructor(modelName, apiKey) {
    const geminiClient = new import_genai.GoogleGenAI({ apiKey });
    super(modelName, geminiClient);
  }
  init() {
    console.log(`Gemini model ${this.getModelName()} initialized`);
  }
  async generateResponse(prompt) {
    try {
      const client = this.getInstance();
      const response = await client.models.generateContent({
        model: this.getModelName(),
        contents: prompt
      });
      const text = response.text;
      if (!text) {
        throw new Error("No content received from Gemini API");
      }
      return text;
    } catch (error) {
      console.error("Error generating response from Gemini:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};
var gemini_default = GeminiModel;

// src/core/ai/anthropic.ts
var import_sdk = __toESM(require("@anthropic-ai/sdk"));
var AnthropicModel = class extends ai_model_default {
  constructor(modelName, apiKey) {
    const anthropicClient = new import_sdk.default({
      apiKey
    });
    super(modelName, anthropicClient);
  }
  init() {
    console.log(`Anthropic model ${this.getModelName()} initialized`);
  }
  async generateResponse(prompt) {
    try {
      const client = this.getInstance();
      const message = await client.messages.create({
        model: this.getModelName(),
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4e3,
        temperature: 0.7
      });
      const content = message.content;
      if (!content) {
        throw new Error("No content received from Anthropic API");
      }
      return processAnthropicResponse(content);
    } catch (error) {
      console.error("Error generating response from Anthropic:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};
var anthropic_default = AnthropicModel;
function processAnthropicResponse(response) {
  let result = "";
  for (const block of response) {
    switch (block.type) {
      case "text":
        result += block.text;
        break;
      case "web_search_tool_result":
        result += block.content;
        break;
      default:
        console.warn(`Unhandled content block type: ${block.type}`);
        break;
    }
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIElementSlot,
  AIModel,
  AnthropicModel,
  GeminiModel,
  OpenaiModel,
  createAIElement
});
