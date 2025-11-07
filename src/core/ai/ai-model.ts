abstract class AIModel<T> {
  private name: string;
  private apiKey: string;
  private instance: T;

  constructor(
    public modelName: string,
    apiKey: string,
    instance: T,
  ) {
    // Initialize the AI model with the provided API key and instance
    this.name = modelName;
    this.apiKey = apiKey;
    this.instance = instance;
    this.init();
  }

  abstract init(): void;
  abstract generateResponse(prompt: string): Promise<string>;

  getModelName(): string {
    return this.name;
  }

  protected getInstance(): T {
    return this.instance;
  }
}

export default AIModel;
