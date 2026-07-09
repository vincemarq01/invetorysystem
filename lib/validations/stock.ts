import { z } from "zod";

export const stockMovementTypes = ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"] as const;

export const createStockMovementSchema = z.object({
  productId: z.string().trim().min(1, "Product is required."),
  type: z.enum(stockMovementTypes),
  quantity: z
    .number()
    .int("Quantity must be a whole number.")
    .refine((value) => value !== 0, "Quantity cannot be zero."),
  note: z.string().trim().optional(),
});

export type CreateStockMovementInput = z.infer<
  typeof createStockMovementSchema
>;
