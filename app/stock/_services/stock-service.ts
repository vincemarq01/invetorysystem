import type {
  StockMovementRow,
  StockProductOption,
} from "../_components/stock-types";
import type { CreateStockMovementInput } from "@/lib/validations/stock";

type ProductsResponse = {
  products?: StockProductOption[];
  message?: string;
};

type StockMovementsResponse = {
  movements?: StockMovementRow[];
  message?: string;
};

type StockMovementResponse = {
  message?: string;
};

export async function fetchStockProducts() {
  const response = await fetch("/api/products", { cache: "no-store" });
  const result = (await response.json()) as ProductsResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Unable to fetch products.");
  }

  return result.products ?? [];
}

export async function fetchStockMovements() {
  const response = await fetch("/api/stock-movements", { cache: "no-store" });
  const result = (await response.json()) as StockMovementsResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Unable to fetch stock movements.");
  }

  return result.movements ?? [];
}

export async function createStockMovement(data: CreateStockMovementInput) {
  const response = await fetch("/api/stock-movements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = (await response.json()) as StockMovementResponse;

  return {
    ok: response.ok,
    message: result.message ?? "Stock movement request completed.",
  };
}
