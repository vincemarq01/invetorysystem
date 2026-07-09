import type { CreateStockMovementInput } from "@/lib/validations/stock";

export type StockProductOption = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
};

export type StockMovementRow = {
  id: string;
  productId: string;
  type: CreateStockMovementInput["type"];
  quantity: number;
  note: string | null;
  createdAt: string;
  product: StockProductOption;
};

export type StockRequestState = {
  ok: boolean;
  message: string;
};
