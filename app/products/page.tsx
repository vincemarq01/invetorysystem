import { Download, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { SearchField } from "@/components/shared/search-field";
import { PageShell } from "@/components/layout/page-shell";
import { quickFilters } from "@/lib/constants";
import { products } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import type { ProductStatus } from "@/types/product";

function productTone(status: ProductStatus) {
  if (status === "In Stock") return "green";
  if (status === "Low Stock") return "amber";
  return "red";
}

export default function ProductsPage() {
  return (
    <PageShell
      title="Products"
      description="Manage product records, stock thresholds, locations, and supplier details."
      actions={
        <>
          <Button variant="secondary">
            <Download aria-hidden="true" className="size-4" />
            Export
          </Button>
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            Add product
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader className="flex-col items-stretch sm:flex-row sm:items-center">
          <SearchField placeholder="Search products or SKU" />
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter}
                variant={filter === "All" ? "primary" : "secondary"}
              >
                {filter}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            headers={[
              "Product",
              "SKU",
              "Category",
              "Supplier",
              "Stock",
              "Price",
              "Location",
              "Status",
              "",
            ]}
            rows={products.map((product) => [
              <span key="name" className="font-medium text-zinc-950">
                {product.name}
              </span>,
              product.sku,
              product.category,
              product.supplier,
              `${product.quantity} units`,
              formatCurrency(product.price),
              product.location,
              <Badge key="status" tone={productTone(product.status)}>
                {product.status}
              </Badge>,
              <div key="actions" className="flex justify-end gap-1">
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label={`Edit ${product.name}`}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </button>
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label={`More actions for ${product.name}`}
                >
                  <MoreHorizontal aria-hidden="true" className="size-4" />
                </button>
              </div>,
            ])}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
