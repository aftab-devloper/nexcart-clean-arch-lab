import { NextRequest, NextResponse } from "next/server";
import { ProductPrismaAdapter } from "../../../../modules/product/adapters/product-prisma.adapter";
import { VoyageEmbeddingAdapter } from "../../../../modules/product/adapters/voyage-embedding.adapter";

const productRepository = new ProductPrismaAdapter();
const embeddingService = new VoyageEmbeddingAdapter();

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "q query param is required" }, { status: 400 });
  }

  const [keywordResults, semanticResults] = await Promise.all([
    productRepository.keywordSearch(q, 5),
    (async () => {
      try {
        const queryEmbedding = await embeddingService.embed(q);
        return await productRepository.semanticSearch(queryEmbedding, 5);
      } catch (error) {
        console.warn("[Search] Semantic search failed, keyword-only fallback:", (error as Error).message);
        return [];
      }
    })(),
  ]);

  // Hybrid merge: combine both result sets, dedupe by id, semantic matches ranked first
  const merged = new Map<string, any>();
  for (const item of semanticResults) {
    merged.set(item.id, { ...item, matchType: "semantic" });
  }
  for (const item of keywordResults) {
    if (!merged.has(item.id)) {
      merged.set(item.id, { ...item, matchType: "keyword" });
    }
  }

  return NextResponse.json({ query: q, results: Array.from(merged.values()) });
}