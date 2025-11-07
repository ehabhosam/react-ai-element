import React, { useMemo } from "react";
import { compileComponent } from "../core/render";
import DefaultErrorComponent from "./error-component";

interface DynamicRendererProps {
  code: string;
  imports?: Record<string, any>;
  ErrorComponent?: React.FC;
}

/**
 * Dynamically compiles and renders a React component
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  code,
  imports = {},
  ErrorComponent = DefaultErrorComponent, // Default error component
}) => {
  const Component = useMemo(
    () => compileComponent(code, imports),
    [code, imports],
  );

  if (Component instanceof Error) {
    return <ErrorComponent />;
  }

  return <Component />;
};

export default DynamicRenderer;
