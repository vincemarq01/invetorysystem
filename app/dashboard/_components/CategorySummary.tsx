import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { formatCurrency } from "@/lib/utils";
import type { DashboardCategory } from "./dashboard-types";

type CategorySummaryProps = {
  categories: DashboardCategory[];
};

export function CategorySummary({ categories }: CategorySummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Category Summary
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Product count, stock count, and value by category.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          headers={["Category", "Products", "Units", "Value"]}
          emptyLabel="No categories to summarize."
          rows={categories.map((category) => [
            <span key="name" className="font-medium text-zinc-950">
              {category.name}
            </span>,
            category.products,
            category.quantity,
            formatCurrency(category.value),
          ])}
        />
      </CardContent>
    </Card>
  );
}
