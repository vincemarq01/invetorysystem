import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required."),
  sku: z.string().trim().min(1, "SKU is required."),
  categoryId: z.string().trim().min(1, "Category is required."),
  brandId: z.string().trim().optional(),
  supplierId: z.string().trim().optional(),
  model: z.string().trim().optional(),
  quantity: z.number().int().min(0, "Quantity must be 0 or higher."),
  reorderLevel: z.number().int().min(0, "Reorder level must be 0 or higher."),
  costPrice: z.number().min(0, "Cost price must be 0 or higher."),
  sellingPrice: z.number().min(0, "Selling price must be 0 or higher."),
  warrantyMonths: z
    .number()
    .int()
    .min(0, "Warranty months must be 0 or higher.")
    .optional(),
  location: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
