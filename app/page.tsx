import { AlertTriangle, ArrowDownRight, ArrowUpRight, PackageCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { dashboardStats, products, stockMovements } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { ProductStatus } from "@/types/product";
import type { StockMovementType } from "@/types/stock";

function productTone(status: ProductStatus) {
  if (status === "In Stock") return "green";
  if (status === "Low Stock") return "amber";
  return "red";
}

function movementTone(type: StockMovementType) {
  if (type === "Stock In") return "green";
  if (type === "Stock Out") return "blue";
  return "amber";
}

export default function DashboardPage() {
  const lowStockProducts = products.filter((product) => product.status !== "In Stock");

  return (
    <PageShell
      title="Dashboard"
      description="Monitor stock health, urgent replenishments, and recent warehouse activity."
      actions={
        <>
          <Button variant="secondary">
            <ArrowDownRight aria-hidden="true" className="size-4" />
            Stock out
          </Button>
          <Button>
            <ArrowUpRight aria-hidden="true" className="size-4" />
            Stock in
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold text-zinc-950">{stat.value}</p>
                <span className="text-xs font-medium text-zinc-500">{stat.delta}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Priority Stock</h2>
              <p className="mt-1 text-sm text-zinc-500">Items requiring reorder or review.</p>
            </div>
            <Button variant="ghost">View all</Button>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Product", "SKU", "Qty", "Reorder", "Value", "Status"]}
              rows={lowStockProducts.map((product) => [
                <span key="name" className="font-medium text-zinc-950">
                  {product.name}
                </span>,
                product.sku,
                product.quantity,
                product.reorderLevel,
                formatCurrency(product.price * product.quantity),
                <Badge key="status" tone={productTone(product.status)}>
                  {product.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Recent Movements</h2>
              <p className="mt-1 text-sm text-zinc-500">Latest stock activity.</p>
            </div>
            <PackageCheck aria-hidden="true" className="size-5 text-zinc-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            {stockMovements.slice(0, 4).map((movement) => (
              <div key={movement.id} className="flex gap-3">
                <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-md bg-zinc-100">
                  <AlertTriangle aria-hidden="true" className="size-4 text-zinc-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-zinc-950">
                      {movement.product}
                    </p>
                    <Badge tone={movementTone(movement.type)}>{movement.type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    {movement.quantity} units by {movement.actor}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
