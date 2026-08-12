import { Product } from "../domain/product.entity";

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  similarity?: number;
}

export interface ProductRepositoryPort {
  save(product: Product): Promise<void>;
  saveEmbedding(productId: string, embedding: number[]): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
  semanticSearch(queryEmbedding: number[], limit?: number): Promise<SearchResult[]>;
  keywordSearch(query: string, limit?: number): Promise<SearchResult[]>;
}