import { PrismaClient } from "@prisma/client";
import { Cart, CartItem } from "../domain/cart.entity";
import { CartRepositoryPort } from "../ports/cart-repository.port";

const prisma = new PrismaClient();

export class CartPrismaAdapter implements CartRepositoryPort {
  async save(cart: Cart): Promise<void> {
    await prisma.cart.upsert({
      where: { userId: cart.userId },
      update: {},
      create: { id: cart.id, userId: cart.userId },
    });

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    if (cart.items.length > 0) {
      await prisma.cartItem.createMany({
        data: cart.items.map((item) => ({
          cartId: cart.id,
          productId: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      });
    }
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const row = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!row) return null;

    const items: CartItem[] = row.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }));

    return Cart.restore(row.id, row.userId, items);
  }
}