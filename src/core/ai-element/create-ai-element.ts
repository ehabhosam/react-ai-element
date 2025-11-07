import React from "react";
import AIModel from "../ai/ai-model";
import { AIElement } from "../../components/ai-element";
import { GenerationConfig } from "../../types";

interface AIElementProps {
  prompt: string;
  // config: GenerationConfig;
  aiElementProps?: Record<string, any>;
  ErrorComponent?: React.ComponentType<any>;
}

export const createAIElement = (
  modelInstance: AIModel<any>,
  config: GenerationConfig,
) => {
  // Return a React component that wraps AIElement with the model instance
  const BoundAIElement: React.FC<AIElementProps> = (props) => {
    return React.createElement(AIElement, { ...props, modelInstance, config });
  };

  // Set display name for debugging
  BoundAIElement.displayName = `AIElement(${modelInstance.getModelName()})`;

  return BoundAIElement;
};
