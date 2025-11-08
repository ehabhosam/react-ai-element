import React from 'react';
import OpenAI from 'openai';
import { ChatModel } from 'openai/resources';
import { GoogleGenAI } from '@google/genai';

declare abstract class AIModel<T> {
    modelName: string;
    private name;
    private instance;
    constructor(modelName: string, instance: T);
    abstract init(): void;
    abstract generateResponse(prompt: string): Promise<string>;
    getModelName(): string;
    protected getInstance(): T;
}

interface GenerationConfig {
    preset: "ts" | "js";
    tailwind: boolean;
    libraries?: Record<string, any>;
}

interface AIElementProps {
    prompt: string;
    aiElementProps?: Record<string, any>;
    ErrorComponent?: React.ComponentType<any>;
    config: GenerationConfig;
    modelInstance: AIModel<any>;
}
declare const createAIElement: (modelInstance: AIModel<any>, config: GenerationConfig) => React.FC<AIElementProps>;

interface AIElementSlotProps {
    height?: string | number;
    width?: string | number;
    children: React.ReactNode;
}
/**
 * AIElementSlot - A container component that provides context wraps <AIElement />.
 *
 * This component serves as the required parent wrapper for <AIElement /> components.
 *
 * @param children - <AIElement /> to be rendered within the slot
 * @param height - Optional height dimension (string with CSS units or number for pixels)
 * @param width - Optional width dimension (string with CSS units or number for pixels)
 */
declare const AIElementSlot: React.FC<AIElementSlotProps>;

declare class OpenaiModel extends AIModel<OpenAI> {
    constructor(modelName: ChatModel, apiKey: string);
    init(): void;
    generateResponse(prompt: string): Promise<string>;
}

declare class GeminiModel extends AIModel<GoogleGenAI> {
    constructor(modelName: string, apiKey: string);
    init(): void;
    generateResponse(prompt: string): Promise<string>;
}

export { type AIElementProps, AIElementSlot, AIModel, GeminiModel, type GenerationConfig, OpenaiModel, createAIElement };
