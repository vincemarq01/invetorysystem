import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ClipboardPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { CreateStockMovementInput } from "@/lib/validations/stock";
import type { StockProductOption, StockRequestState } from "./stock-types";

type StockMovementFormProps = {
  errors: FieldErrors<CreateStockMovementInput>;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  products: StockProductOption[];
  register: UseFormRegister<CreateStockMovementInput>;
  requestState: StockRequestState;
};

export function StockMovementForm({
  errors,
  isSubmitting,
  onSubmit,
  products,
  register,
  requestState,
}: StockMovementFormProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Record Movement
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Add stock in, stock out, or inventory adjustment entries.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-6">
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Product</span>
            <select
              {...register("productId")}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - {product.quantity} units
                </option>
              ))}
            </select>
            {errors.productId ? (
              <p className="text-xs text-red-600">
                {errors.productId.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">Type</span>
            <select
              {...register("type")}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100"
            >
              <option value="STOCK_IN">Stock in</option>
              <option value="STOCK_OUT">Stock out</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
            {errors.type ? (
              <p className="text-xs text-red-600">{errors.type.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-700">Quantity</span>
            <Input
              {...register("quantity", { valueAsNumber: true })}
              placeholder="10"
              type="number"
            />
            {errors.quantity ? (
              <p className="text-xs text-red-600">
                {errors.quantity.message}
              </p>
            ) : null}
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-medium text-zinc-700">Note</span>
            <Input
              {...register("note")}
              placeholder="Supplier delivery, sold item, count correction"
            />
          </label>

          <div className="flex items-end lg:col-span-1">
            <Button className="w-full" disabled={isSubmitting} type="submit">
              <ClipboardPlus aria-hidden="true" className="size-4" />
              {isSubmitting ? "Saving" : "Save"}
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
