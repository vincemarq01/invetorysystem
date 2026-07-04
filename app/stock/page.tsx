import { ArrowDownRight, ArrowUpRight, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { SearchField } from "@/components/shared/search-field";
import { PageShell } from "@/components/layout/page-shell";
import { stockMovements } from "@/lib/mock-data";
import type { StockMovementType } from "@/types/stock";

function movementTone(type: StockMovementType) {
  if (type === "Stock In") return "green";
  if (type === "Stock Out") return "blue";
  return "amber";
}

export default function StockPage() {
  return (
    <PageShell
      title="Stock Movements"
      description="Track inbound items, outbound releases, and inventory adjustments."
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
      <Card>
        <CardHeader className="flex-col items-stretch sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Movement History</h2>
            <p className="mt-1 text-sm text-zinc-500">Mock activity log for warehouse flow.</p>
          </div>
          <SearchField placeholder="Search movement records" />
        </CardHeader>
        <CardContent>
          <DataTable
            headers={["Ref", "Product", "SKU", "Type", "Qty", "Handled by", "Date", "Note"]}
            rows={stockMovements.map((movement) => [
              <span key="id" className="font-medium text-zinc-950">
                {movement.id}
              </span>,
              movement.product,
              movement.sku,
              <Badge key="type" tone={movementTone(movement.type)}>
                {movement.type}
              </Badge>,
              movement.quantity,
              movement.actor,
              movement.date,
              movement.note,
            ])}
          />
        </CardContent>
      </Card>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {["Receiving", "Picking", "Cycle Count"].map((queue) => (
          <Card key={queue}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid size-10 place-items-center rounded-md bg-zinc-100">
                <ClipboardList aria-hidden="true" className="size-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-950">{queue}</p>
                <p className="text-sm text-zinc-500">Ready for next workflow</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
