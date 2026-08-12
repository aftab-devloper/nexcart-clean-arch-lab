import { Product } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";

export class GetProductsQuery {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}