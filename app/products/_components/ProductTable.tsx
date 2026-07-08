import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { SearchField } from "@/components/shared/search-field";
import { quickFilters } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { ProductRow } from "./product-types";

type ProductTableProps = {
  deletingId: string | null;
  error: string;
  isLoading: boolean;
  onDeleteProduct: (productId: string) => void;
  onEditProduct: (product: ProductRow) => void;
  products: ProductRow[];
};

function getProductStatus(product: ProductRow) {
  if (product.quantity === 0) {
    return { label: "Out of Stock", tone: "red" as const };
  }

  if (product.quantity <= product.reorderLevel) {
    return { label: "Low Stock", tone: "amber" as const };
  }

  return { label: "In Stock", tone: "green" as const };
}

export function ProductTable({
  deletingId,
  error,
  isLoading,
  onDeleteProduct,
  onEditProduct,
  products,
}: ProductTableProps) {
  return (
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
        {error ? (
          <p className="mb-3 text-sm font-medium text-red-600">{error}</p>
        ) : null}
        <DataTable
          headers={[
            "Product",
            "SKU",
            "Model",
            "Category",
            "Brand",
            "Supplier",
            "Stock",
            "Cost",
            "Selling",
            "Location",
            "Status",
            "",
          ]}
          emptyLabel={isLoading ? "Loading products..." : "No products found."}
          rows={products.map((product) => {
            const status = getProductStatus(product);

            return [
              <span key="name" className="font-medium text-zinc-950">
                {product.name}
              </span>,
              product.sku,
              product.model ?? "-",
              product.category?.name ?? "Uncategorized",
              product.brandId ?? "No brand",
              product.supplierId ?? "No supplier",
              `${product.quantity} units`,
              formatCurrency(Number(product.costPrice)),
              formatCurrency(Number(product.sellingPrice)),
              product.location ?? "-",
              <Badge key="status" tone={status.tone}>
                {status.label}
              </Badge>,
              <div key="actions" className="flex justify-end gap-1">
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label={`Edit ${product.name}`}
                  onClick={() => onEditProduct(product)}
                  type="button"
                >
                  <Pencil aria-hidden="true" className="size-4" />
                </button>
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${product.name}`}
                  disabled={deletingId === product.id}
                  onClick={() => onDeleteProduct(product.id)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </button>
                <button
                  className="grid size-8 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label={`More actions for ${product.name}`}
                  type="button"
                >
                  <MoreHorizontal aria-hidden="true" className="size-4" />
                </button>
              </div>,
            ];
          })}
        />
      </CardContent>
    </Card>
  );
}
