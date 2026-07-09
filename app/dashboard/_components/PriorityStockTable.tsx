import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { formatCurrency } from "@/lib/utils";
import type { DashboardProduct } from "./dashboard-types";

type PriorityStockTableProps = {
  products: DashboardProduct[];
};

function getProductStatus(product: DashboardProduct) {
  if (product.quantity === 0) {
    return {
      label: "Out of Stock",
      tone: "red" as const,
    };
  }

  return {
    label: "Low Stock",
    tone: "amber" as const,
  };
}

export function PriorityStockTable({ products }: PriorityStockTableProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Priority Stock
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Items that need reorder or inventory review.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          headers={["Product", "SKU", "Category", "Qty", "Reorder", "Value", "Status"]}
          emptyLabel="No low stock products."
          rows={products.map((product) => {
            const status = getProductStatus(product);

            return [
              <span key="name" className="font-medium text-zinc-950">
                {product.name}
              </span>,
              product.sku,
              product.category,
              product.quantity,
              product.reorderLevel,
              formatCurrency(product.value),
              <Badge key="status" tone={status.tone}>
                {status.label}
              </Badge>,
            ];
          })}
        />
      </CardContent>
    </Card>
  );
}
