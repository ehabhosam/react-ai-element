abstract class AIModel<T> {
  private name: string;
  private instance: T;

  constructor(
    public modelName: string,
    instance: T,
  ) {
    this.name = modelName;
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
