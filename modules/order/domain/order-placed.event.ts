export interface OrderPlacedItem {
  productId: string;
  productName: string;
  quantity: number;
}

export class OrderPlacedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderPlacedItem[],
    public readonly total: number,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

type Listener = (event: OrderPlacedEvent) => void;

class OrderEventBus {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  publish(event: OrderPlacedEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

export const orderEventBus = new OrderEventBus();