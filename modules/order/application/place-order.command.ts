import { randomUUID } from "crypto";
import { Order } from "../domain/order.entity";
import { OrderRepositoryPort } from "../ports/order-repository.port";
import { orderEventBus, OrderPlacedEvent } from "../domain/order-placed.event";
import { CartRepositoryPort } from "../../cart/ports/cart-repository.port";

export class PlaceOrderCommand {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly cartRepository: CartRepositoryPort,
  ) {}

  async execute(userId: string): Promise<Order> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart || cart.isEmpty()) {
      throw new Error("Cannot place an order with an empty cart");
    }

    const order = Order.create(
      randomUUID(),
      userId,
      cart.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
    );

    await this.orderRepository.save(order);

    orderEventBus.publish(
      new OrderPlacedEvent(
        order.id,
        order.userId,
        order.items.map((i) => ({ productId: i.productId, productName: i.productName, quantity: i.quantity })),
        order.getTotal(),
      ),
    );

    cart.items = [];
    await this.cartRepository.save(cart);

    return order;
  }
}