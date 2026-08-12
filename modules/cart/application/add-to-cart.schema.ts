import { z } from "zod";

export const addToCartSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  productId: z.string().min(1, "productId is required"),
  productName: z.string().min(1),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive(),
});