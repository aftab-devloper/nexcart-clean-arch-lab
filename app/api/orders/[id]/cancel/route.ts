import { NextResponse } from "next/server";
import { OrderPrismaAdapter } from "../../../../../modules/order/adapters/order-prisma.adapter";

const orderRepository = new OrderPrismaAdapter();

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await orderRepository.findById(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    order.cancel();
    await orderRepository.save(order);
    return NextResponse.json({ ...order, total: order.getTotal() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}