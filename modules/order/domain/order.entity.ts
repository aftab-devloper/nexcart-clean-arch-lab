export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export class Order {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public status: OrderStatus,
  ) {}

  static create(id: string, userId: string, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new Error("Cannot create an order with no items");
    }
    return new Order(id, userId, items, "pending");
  }

  static restore(id: string, userId: string, items: OrderItem[], status: OrderStatus): Order {
    return new Order(id, userId, items, status);
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  }

  markShipped(): void {
    if (this.status !== "pending") {
      throw new Error(`Cannot ship an order that is ${this.status}`);
    }
    this.status = "shipped";
  }

  markDelivered(): void {
    if (this.status !== "shipped") {
      throw new Error(`Cannot deliver an order that is ${this.status}`);
    }
    this.status = "delivered";
  }

  cancel(): void {
    if (this.status !== "pending") {
      throw new Error(`Cannot cancel an order that is already ${this.status}`);
    }
    this.status = "cancelled";
  }
}