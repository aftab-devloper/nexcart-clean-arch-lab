import { randomUUID } from "crypto";
import { Cart } from "../domain/cart.entity";
import { CartRepositoryPort } from "../ports/cart-repository.port";

export class AddToCartCommand {
  constructor(private readonly cartRepository: CartRepositoryPort) {}

  async execute(input: {
    userId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(input.userId);

    if (!cart) {
      cart = Cart.create(randomUUID(), input.userId);
    }

    cart.addItem({
      productId: input.productId,
      productName: input.productName,
      unitPrice: input.unitPrice,
      quantity: input.quantity,
    });

    await this.cartRepository.save(cart);
    return cart;
  }
}