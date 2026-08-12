import { AIDescriptionPort } from "../ports/ai-description.port";

export class EnhanceDescriptionCommand {
  constructor(private readonly aiDescriptionService: AIDescriptionPort) {}

  async execute(input: { name: string; description: string }): Promise<string> {
    return this.aiDescriptionService.enhanceDescription(input.name, input.description);
  }
}