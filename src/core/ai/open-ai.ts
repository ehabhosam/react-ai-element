import OpenAI from "openai";
import AIModel from "./ai-model";
import { ChatModel } from "openai/resources";

class OpenaiModel extends AIModel<OpenAI> {
  constructor(modelName: ChatModel, apiKey: string) {
    const openaiClient = new OpenAI({
      apiKey: apiKey,
    });
    super(modelName, openaiClient);
  }

  init(): void {
    // Initialize OpenAI client - already done in constructor
    // This method can be used for additional setup if needed
    console.log(`OpenAI model ${this.getModelName()} initialized`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const client = this.getInstance();
      const response = await client.chat.completions.create({
        model: this.getModelName(),
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from OpenAI API");
      }

      return content;
    } catch (error) {
      console.error("Error generating response from OpenAI:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export default OpenaiModel;
