type State = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: State = "closed";
  private failureCount = 0;
  private readonly failureThreshold: number;
  private readonly cooldownMs: number;
  private openedAt: number | null = null;

  constructor(failureThreshold = 3, cooldownMs = 30_000) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
  }

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === "open") {
      const elapsed = Date.now() - (this.openedAt ?? 0);
      if (elapsed < this.cooldownMs) {
        console.warn("[CircuitBreaker] OPEN — skipping call, using fallback");
        return fallback();
      }
      this.state = "half-open";
      console.warn("[CircuitBreaker] HALF-OPEN — trying one test call");
    }

    try {
      const result = await fn();
      if (this.state === "half-open") {
        console.log("[CircuitBreaker] Test call succeeded — closing circuit");
      }
      this.state = "closed";
      this.failureCount = 0;
      return result;
    } catch (error) {
      this.failureCount += 1;
      console.warn(`[CircuitBreaker] Failure ${this.failureCount}/${this.failureThreshold}`);

      if (this.failureCount >= this.failureThreshold) {
        this.state = "open";
        this.openedAt = Date.now();
        console.error("[CircuitBreaker] Threshold hit — circuit OPEN for", this.cooldownMs, "ms");
      }

      return fallback();
    }
  }
}