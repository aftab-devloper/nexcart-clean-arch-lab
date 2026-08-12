export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export class Cart {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public items: CartItem[],
  ) {}

  static create(id: string, userId: string): Cart {
    return new Cart(id, userId, []);
  }

  static restore(id: string, userId: string, items: CartItem[]): Cart {
    return new Cart(id, userId, items);
  }

  addItem(item: CartItem): void {
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const existing = this.items.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push(item);
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  assertCanCheckout(): void {
    if (this.isEmpty()) {
      throw new Error("Cannot checkout an empty cart");
    }
  }
}