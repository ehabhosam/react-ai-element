import { GoogleGenAI } from "@google/genai";
import AIModel from "./ai-model";

class GeminiModel extends AIModel<GoogleGenAI> {
  constructor(modelName: string, apiKey: string) {
    const geminiClient = new GoogleGenAI({ apiKey: apiKey });
    super(modelName, geminiClient);
  }

  init(): void {
    // Initialize Gemini client - already done in constructor
    // This method can be used for additional setup if needed
    console.log(`Gemini model ${this.getModelName()} initialized`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const client = this.getInstance();

      const response = await client.models.generateContent({
        model: this.getModelName(),
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error("No content received from Gemini API");
      }

      return text;
    } catch (error) {
      console.error("Error generating response from Gemini:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export default GeminiModel;
