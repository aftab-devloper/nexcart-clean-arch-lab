import { randomUUID } from "crypto";
import { Product } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";
import { EmbeddingPort } from "../ports/embedding.port";
import { productEventBus, ProductCreatedEvent } from "../domain/product-created.event";

export class CreateProductCommand {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly embeddingService: EmbeddingPort,
  ) {}

  async execute(input: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }): Promise<Product> {
    const product = Product.create({
      id: randomUUID(),
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
    });

    await this.productRepository.save(product);

    try {
      const embedding = await this.embeddingService.embed(`${product.name}. ${product.description}`);
      await this.productRepository.saveEmbedding(product.id, embedding);
    } catch (error) {
      console.warn("[Embedding] Failed to generate/save embedding:", (error as Error).message);
    }

    productEventBus.publish(new ProductCreatedEvent(product.id, product.name));

    return product;
  }
}