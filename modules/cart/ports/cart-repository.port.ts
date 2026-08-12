import { Cart } from "../domain/cart.entity";

export interface CartRepositoryPort {
  save(cart: Cart): Promise<void>;
  findByUserId(userId: string): Promise<Cart | null>;
}