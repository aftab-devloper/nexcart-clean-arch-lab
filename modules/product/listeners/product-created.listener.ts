import { productEventBus, ProductCreatedEvent } from "../domain/product-created.event";

productEventBus.subscribe((event: ProductCreatedEvent) => {
  console.log(`[EVENT] ProductCreated -> id=${event.productId}, name=${event.name}, at=${event.occurredAt.toISOString()}`);
});