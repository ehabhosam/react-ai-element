import React from "react";
import AIModel from "../ai/ai-model";
import { AIElement } from "../../components/ai-element";
import { GenerationConfig } from "../../types";
import { libraryRegistry } from "../library-registry";

export interface AIElementProps {
  prompt: string;
  aiElementProps?: Record<string, any>;
  ErrorComponent?: React.ComponentType<any>;
  config: GenerationConfig;
  modelInstance: AIModel<any>;
}

export const createAIElement = (
  modelInstance: AIModel<any>,
  config: GenerationConfig,
) => {
  // Register libraries if provided in config
  // (libraries get registered globally in the library registry singleton)
  if (config.libraries) {
    for (const [name, library] of Object.entries(config.libraries)) {
      libraryRegistry.register(name, { library });
    }
  }

  // Return a React component that wraps AIElement with the model instance
  const BoundAIElement: React.FC<AIElementProps> = (props) => {
    return React.createElement(AIElement, { ...props, modelInstance, config });
  };

  // Set display name for debugging
  BoundAIElement.displayName = `AIElement(${modelInstance.getModelName()})`;

  return BoundAIElement;
};
