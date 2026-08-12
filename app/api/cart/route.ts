import { NextRequest, NextResponse } from "next/server";
import { CartPrismaAdapter } from "../../../modules/cart/adapters/cart-prisma.adapter";
import { AddToCartCommand } from "../../../modules/cart/application/add-to-cart.command";
import { GetCartQuery } from "../../../modules/cart/application/get-cart.query";
import { addToCartSchema } from "../../../modules/cart/application/add-to-cart.schema";
import { isRateLimited } from "../../../modules/shared/rate-limiter";

const cartRepository = new CartPrismaAdapter();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query param is required" }, { status: 400 });
  }

  const query = new GetCartQuery(cartRepository);
  const cart = await query.execute(userId);

  return NextResponse.json(cart ?? { items: [], total: 0 });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = addToCartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const command = new AddToCartCommand(cartRepository);
    const cart = await command.execute(parsed.data);
    return NextResponse.json({ ...cart, total: cart.getTotal() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}