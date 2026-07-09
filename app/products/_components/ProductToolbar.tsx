import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductToolbarProps = {
  onAddProduct: () => void;
};

export function ProductToolbar({ onAddProduct }: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xl font-medium text-zinc-950">Product</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary">
          <Download aria-hidden="true" className="size-4" />
          Export
        </Button>

        <Button onClick={onAddProduct}>
          <Plus aria-hidden="true" className="size-4" />
          Add product
        </Button>
      </div>
    </div>
  );
}
