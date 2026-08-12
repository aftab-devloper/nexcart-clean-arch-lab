import { Cart } from "../domain/cart.entity";
import { CartRepositoryPort } from "../ports/cart-repository.port";

export class GetCartQuery {
  constructor(private readonly cartRepository: CartRepositoryPort) {}

  async execute(userId: string): Promise<Cart | null> {
    return this.cartRepository.findByUserId(userId);
  }
}