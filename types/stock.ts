export type StockMovementType = "Stock In" | "Stock Out" | "Adjustment";

export type StockMovement = {
  id: string;
  product: string;
  sku: string;
  type: StockMovementType;
  quantity: number;
  actor: string;
  date: string;
  note: string;
};
