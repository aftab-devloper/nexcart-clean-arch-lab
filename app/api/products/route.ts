import { NextRequest, NextResponse } from "next/server";
import { ProductPrismaAdapter } from "../../../modules/product/adapters/product-prisma.adapter";
import { VoyageEmbeddingAdapter } from "../../../modules/product/adapters/voyage-embedding.adapter";
import { CreateProductCommand } from "../../../modules/product/application/create-product.command";
import { GetProductsQuery } from "../../../modules/product/application/get-products.query";
import { createProductSchema } from "../../../modules/product/application/create-product.schema";
import { isRateLimited } from "../../../modules/shared/rate-limiter";
import "../../../modules/product/listeners/product-created.listener";

const productRepository = new ProductPrismaAdapter();
const embeddingService = new VoyageEmbeddingAdapter();

export async function GET() {
  const query = new GetProductsQuery(productRepository);
  const products = await query.execute();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const command = new CreateProductCommand(productRepository, embeddingService);
    const product = await command.execute(parsed.data);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}