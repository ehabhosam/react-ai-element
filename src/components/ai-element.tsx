import React, { useState, useEffect } from "react";
import { useSlotContext } from "./ai-element-slot";
import AIModel from "../core/ai/ai-model";
import { DynamicRenderer } from "./dynamic-renderer";
import { generateUIPrompt } from "../core/prompts";
import { GenerationConfig } from "../types";

interface AIElementProps {
  modelInstance: AIModel<any>;
  prompt: string;
  config: GenerationConfig;
  aiElementProps?: Record<string, any>;
  ErrorComponent?: React.ComponentType<any>;
}

export const AIElement: React.FC<AIElementProps> = ({
  prompt,
  config,
  aiElementProps = {},
  ErrorComponent,
  modelInstance,
}) => {
  const insideSlot = useSlotContext();
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!insideSlot) {
    throw new Error(
      "AIElement must be used inside an AIElementSlot component.",
    );
  }

  useEffect(() => {
    const generateCode = async () => {
      if (!prompt.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        const generationPrompt = generateUIPrompt(prompt, config);
        const code = await modelInstance.generateResponse(generationPrompt);
        console.log(code);
        setGeneratedCode(code);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate code",
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateCode();
  }, [prompt, modelInstance]);

  if (isLoading) {
    return <div className="ai-element-loading">Generating component...</div>;
  }

  if (error) {
    return (
      <div className="ai-element-error">
        <p>Error generating component: {error}</p>
      </div>
    );
  }

  if (!generatedCode) {
    return <div className="ai-element-empty">No code generated</div>;
  }

  return (
    <DynamicRenderer
      code={generatedCode}
      componentProps={aiElementProps}
      ErrorComponent={ErrorComponent}
    />
  );
};
