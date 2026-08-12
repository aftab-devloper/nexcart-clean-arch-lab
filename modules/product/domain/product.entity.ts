export class Product {
  private constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
  ) {}

  static create(props: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
  }): Product {
    if (props.price <= 0) {
      throw new Error("Product price must be greater than zero");
    }
    if (props.stock < 0) {
      throw new Error("Product stock cannot be negative");
    }
    return new Product(props.id, props.name, props.description, props.price, props.stock);
  }

  reduceStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error("Insufficient stock");
    }
    this.stock -= quantity;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }
}