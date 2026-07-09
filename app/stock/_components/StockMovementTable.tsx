import { ArrowDownRight, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { SearchField } from "@/components/shared/search-field";
import type { StockMovementRow } from "./stock-types";

type StockMovementTableProps = {
  error: string;
  isLoading: boolean;
  movements: StockMovementRow[];
};

function getMovementLabel(type: StockMovementRow["type"]) {
  if (type === "STOCK_IN") {
    return "Stock In";
  }

  if (type === "STOCK_OUT") {
    return "Stock Out";
  }

  return "Adjustment";
}

function getMovementTone(type: StockMovementRow["type"]) {
  if (type === "STOCK_IN") {
    return "green";
  }

  if (type === "STOCK_OUT") {
    return "blue";
  }

  return "amber";
}

function getMovementIcon(type: StockMovementRow["type"]) {
  if (type === "STOCK_IN") {
    return <ArrowUpRight aria-hidden="true" className="size-4" />;
  }

  if (type === "STOCK_OUT") {
    return <ArrowDownRight aria-hidden="true" className="size-4" />;
  }

  return <SlidersHorizontal aria-hidden="true" className="size-4" />;
}

function formatMovementDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatQuantity(quantity: number) {
  return quantity > 0 ? `+${quantity}` : String(quantity);
}

export function StockMovementTable({
  error,
  isLoading,
  movements,
}: StockMovementTableProps) {
  return (
    <Card>
      <CardHeader className="flex-col items-stretch sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Movement History
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Latest stock updates from product activity.
          </p>
        </div>
        <SearchField placeholder="Search movement records" />
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="mb-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
        <DataTable
          headers={["Product", "SKU", "Type", "Qty", "Date", "Note"]}
          emptyLabel={
            isLoading ? "Loading stock movements..." : "No stock movements yet."
          }
          rows={movements.map((movement) => [
            <span key="product" className="font-medium text-zinc-950">
              {movement.product.name}
            </span>,
            movement.product.sku,
            <Badge key="type" tone={getMovementTone(movement.type)}>
              <span className="inline-flex items-center gap-1">
                {getMovementIcon(movement.type)}
                {getMovementLabel(movement.type)}
              </span>
            </Badge>,
            formatQuantity(movement.quantity),
            formatMovementDate(movement.createdAt),
            movement.note ?? "-",
          ])}
        />
      </CardContent>
    </Card>
  );
}
