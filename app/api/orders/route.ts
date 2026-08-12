import { NextRequest, NextResponse } from "next/server";
import { OrderPrismaAdapter } from "../../../modules/order/adapters/order-prisma.adapter";
import { CartPrismaAdapter } from "../../../modules/cart/adapters/cart-prisma.adapter";
import { PlaceOrderCommand } from "../../../modules/order/application/place-order.command";
import { isRateLimited } from "../../../modules/shared/rate-limiter";
import "../../../modules/order/listeners/order-placed.listeners";

const orderRepository = new OrderPrismaAdapter();
const cartRepository = new CartPrismaAdapter();

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId query param is required" }, { status: 400 });
  }

  const orders = await orderRepository.findByUserId(userId);
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests, slow down" }, { status: 429 });
  }

  const body = await req.json();

  if (!body.userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const command = new PlaceOrderCommand(orderRepository, cartRepository);
    const order = await command.execute(body.userId);
    return NextResponse.json({ ...order, total: order.getTotal() }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}