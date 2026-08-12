export class ProductCreatedEvent {
  constructor(
    public readonly productId: string,
    public readonly name: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

type Listener = (event: ProductCreatedEvent) => void;

class ProductEventBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  publish(event: ProductCreatedEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export const productEventBus = new ProductEventBus();