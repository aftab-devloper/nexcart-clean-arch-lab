import { PrismaClient } from "@prisma/client";
import { Order, OrderItem, OrderStatus } from "../domain/order.entity";
import { OrderRepositoryPort } from "../ports/order-repository.port";

const prisma = new PrismaClient();

export class OrderPrismaAdapter implements OrderRepositoryPort {
  async save(order: Order): Promise<void> {
    await prisma.order.upsert({
      where: { id: order.id },
      update: { status: order.status },
      create: {
        id: order.id,
        userId: order.userId,
        status: order.status,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const rows = await prisma.order.findMany({ where: { userId }, include: { items: true } });
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: any): Order {
    const items: OrderItem[] = row.items.map((i: any) => ({
      productId: i.productId,
      productName: i.productName,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }));
    return Order.restore(row.id, row.userId, items, row.status as OrderStatus);
  }
}