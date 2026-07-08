import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CreateProductInput } from "@/lib/validations/product";
import type { ProductRequestState } from "./product-types";

type ProductFormProps = {
  categories: Array<{
    id: string;
    name: string;
  }>;
  categoryError: string;
  editingProductId: string | null;
  errors: FieldErrors<CreateProductInput>;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<void>;
  register: UseFormRegister<CreateProductInput>;
  requestState: ProductRequestState;
};

export function ProductForm({
  categories,
  categoryError,
  editingProductId,
  errors,
  isSubmitting,
  onCancel,
  onSubmit,
  register,
  requestState,
}: ProductFormProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            {editingProductId ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {editingProductId
              ? "Update the selected product record."
              : "Create a product record in PostgreSQL through Prisma."}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-6">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-zinc-700">
              Product name
            </span>
            <Input {...register("name")} placeholder="Barcode Scanner X200" />
            {errors.name ? (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">SKU</span>
            <Input {...register("sku")} placeholder="BSC-X200" />
            {errors.sku ? (
              <p className="text-xs text-red-600">{errors.sku.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">Category</span>
            <select
              {...register("categoryId")}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
              disabled={categories.length === 0}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p className="text-xs text-red-600">
                {errors.categoryId.message}
              </p>
            ) : null}
            {categoryError ? (
              <p className="text-xs text-red-600">{categoryError}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">Model</span>
            <Input {...register("model")} placeholder="RTX 4060 Dual 8GB" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">Quantity</span>
            <Input
              {...register("quantity", { valueAsNumber: true })}
              type="number"
              min="0"
            />
            {errors.quantity ? (
              <p className="text-xs text-red-600">{errors.quantity.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              Reorder level
            </span>
            <Input
              {...register("reorderLevel", { valueAsNumber: true })}
              type="number"
              min="0"
            />
            {errors.reorderLevel ? (
              <p className="text-xs text-red-600">
                {errors.reorderLevel.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              Cost price
            </span>
            <Input
              {...register("costPrice", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
            />
            {errors.costPrice ? (
              <p className="text-xs text-red-600">
                {errors.costPrice.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              Selling price
            </span>
            <Input
              {...register("sellingPrice", { valueAsNumber: true })}
              type="number"
              min="0"
              step="0.01"
            />
            {errors.sellingPrice ? (
              <p className="text-xs text-red-600">
                {errors.sellingPrice.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">
              Warranty months
            </span>
            <Input
              {...register("warrantyMonths", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              type="number"
              min="0"
            />
            {errors.warrantyMonths ? (
              <p className="text-xs text-red-600">
                {errors.warrantyMonths.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Location</span>
            <Input {...register("location")} placeholder="Aisle A1" />
          </label>

          <label className="space-y-2 lg:col-span-3">
            <span className="text-sm font-medium text-zinc-700">
              Description
            </span>
            <Input
              {...register("description")}
              placeholder="Optional product notes"
            />
          </label>

          <div className="flex items-end gap-3 lg:col-span-1">
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {editingProductId ? (
                <Pencil aria-hidden="true" className="size-4" />
              ) : (
                <Plus aria-hidden="true" className="size-4" />
              )}
              {isSubmitting ? "Saving" : editingProductId ? "Update" : "Save"}
            </Button>
          </div>

          <div className="lg:col-span-6">
            <Button
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </div>

          {requestState.message ? (
            <p
              className={
                requestState.ok
                  ? "text-sm font-medium text-emerald-700 lg:col-span-6"
                  : "text-sm font-medium text-red-600 lg:col-span-6"
              }
            >
              {requestState.message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
