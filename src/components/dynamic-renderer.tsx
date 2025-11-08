import React, { useMemo } from "react";
import { compileComponent } from "../core/render";
import DefaultErrorComponent from "./error-component";
import { libraryRegistry } from "../core/library-registry";

interface DynamicRendererProps {
  code: string;
  imports?: Record<string, any>;
  componentProps?: Record<string, any>;
  ErrorComponent?: React.ComponentType<any>;
  preset: "ts" | "js";
}

/**
 * Dynamically compiles and renders a React component
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  code,
  imports = {},
  ErrorComponent = DefaultErrorComponent, // Default error component
  componentProps = {},
  preset,
}) => {
  const Component = useMemo(() => {
    // Merge registry imports with user-provided imports
    const allImports = {
      ...libraryRegistry.getImportMap(),
      ...imports,
    };

    return compileComponent(code, allImports, preset);
  }, [code, imports]);

  if (Component instanceof Error) {
    console.error("DynamicRenderer compilation error:", Component);
    return <ErrorComponent error={Component} />;
  }

  return <Component {...componentProps} />;
};

export default DynamicRenderer;
