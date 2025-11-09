import Anthropic from "@anthropic-ai/sdk";
import AIModel from "./ai-model";
import { ContentBlock } from "@anthropic-ai/sdk/resources";

class AnthropicModel extends AIModel<Anthropic> {
  constructor(modelName: Anthropic.Messages.Model, apiKey: string) {
    const anthropicClient = new Anthropic({
      apiKey: apiKey,
    });
    super(modelName, anthropicClient);
  }

  init(): void {
    // Initialize Anthropic client - already done in constructor
    // This method can be used for additional setup if needed
    console.log(`Anthropic model ${this.getModelName()} initialized`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const client = this.getInstance();
      const message = await client.messages.create({
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

      const content = message.content;

      if (!content) {
        throw new Error("No content received from Anthropic API");
      }

      return processAnthropicResponse(content);
    } catch (error) {
      console.error("Error generating response from Anthropic:", error);
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export default AnthropicModel;

function processAnthropicResponse(response: ContentBlock[]): string {
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
