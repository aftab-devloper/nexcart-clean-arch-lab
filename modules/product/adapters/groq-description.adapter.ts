import { AIDescriptionPort } from "../ports/ai-description.port";
import { CircuitBreaker } from "../../shared/circuit-breaker";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:4000";
const TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("AI service request timed out")), ms)),
  ]);
}

const breaker = new CircuitBreaker(3, 30_000);

export class GroqDescriptionAdapter implements AIDescriptionPort {
  async enhanceDescription(productName: string, rawDescription: string): Promise<string> {
    return breaker.execute(
      async () => {
        const response = await withTimeout(
          fetch(`${AI_SERVICE_URL}/enhance-description`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: productName, description: rawDescription, tier: "tier1" }),
          }),
          TIMEOUT_MS,
        );

        if (!response.ok) {
          throw new Error(`AI service returned ${response.status}`);
        }

        const data = await response.json();
        return data.enhanced ?? rawDescription;
      },
      () => rawDescription,
    );
  }
}