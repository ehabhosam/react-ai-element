import React, { useMemo } from "react";
import { compileComponent } from "../core/render";
import DefaultErrorComponent from "./error-component";

interface DynamicRendererProps {
  code: string;
  imports?: Record<string, any>;
  componentProps?: Record<string, any>;
  ErrorComponent?: React.ComponentType<any>;
}

/**
 * Dynamically compiles and renders a React component
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({
  code,
  imports = {},
  ErrorComponent = DefaultErrorComponent, // Default error component
  componentProps = {},
}) => {
  const Component = useMemo(
    () => compileComponent(code, imports),
    [code, imports],
  );

  if (Component instanceof Error) {
    console.log(Component);
    return <ErrorComponent />;
  }

  return <Component {...componentProps} />;
};

export default DynamicRenderer;
