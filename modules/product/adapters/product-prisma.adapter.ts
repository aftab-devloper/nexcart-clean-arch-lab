import { PrismaClient } from "@prisma/client";
import { Product } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";

const prisma = new PrismaClient();

export class ProductPrismaAdapter implements ProductRepositoryPort {
  async save(product: Product): Promise<void> {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
      create: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
    });
  }

  async saveEmbedding(productId: string, embedding: number[]): Promise<void> {
    const vectorLiteral = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
      `UPDATE products SET embedding = $1::vector WHERE id = $2`,
      vectorLiteral,
      productId,
    );
  }

  async findById(id: string): Promise<Product | null> {
    const row = await prisma.product.findUnique({ where: { id } });
    if (!row) return null;
    return Product.create({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
    });
  }

  async findAll(): Promise<Product[]> {
    const rows = await prisma.product.findMany();
    return rows.map((row) =>
      Product.create({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  async semanticSearch(queryEmbedding: number[], limit: number = 5): Promise<Array<{ id: string; name: string; description: string; price: number; similarity: number }>> {
    const vectorLiteral = `[${queryEmbedding.join(",")}]`;
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, description, price, 1 - (embedding <=> $1::vector) AS similarity
       FROM products
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      vectorLiteral,
      limit,
    );
    return rows;
  }

  async keywordSearch(query: string, limit: number = 5): Promise<Array<{ id: string; name: string; description: string; price: number }>> {
    return prisma.$queryRawUnsafe<any[]>(
      `SELECT id, name, description, price
       FROM products
       WHERE name ILIKE $1 OR description ILIKE $1
       LIMIT $2`,
      `%${query}%`,
      limit,
    );
  }
}