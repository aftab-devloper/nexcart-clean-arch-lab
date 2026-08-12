import { orderEventBus, OrderPlacedEvent } from "../domain/order-placed.event";

// Email service — sends confirmation
orderEventBus.subscribe((event: OrderPlacedEvent) => {
  console.log(`[EMAIL] Sending order confirmation for order ${event.orderId} to user ${event.userId}, total: $${event.total}`);
});

// Inventory service — reduces stock
orderEventBus.subscribe((event: OrderPlacedEvent) => {
  for (const item of event.items) {
    console.log(`[INVENTORY] Reducing stock for product ${item.productId} by ${item.quantity}`);
  }
});

// Analytics service — logs the sale
orderEventBus.subscribe((event: OrderPlacedEvent) => {
  console.log(`[ANALYTICS] Order placed: ${event.orderId}, revenue: $${event.total}, at ${event.occurredAt.toISOString()}`);
});