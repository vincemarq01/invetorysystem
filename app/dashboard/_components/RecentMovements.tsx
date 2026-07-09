import {
  ArrowDownRight,
  ArrowUpRight,
  PackageCheck,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type {
  DashboardMovement,
  DashboardMovementType,
} from "./dashboard-types";

type RecentMovementsProps = {
  movements: DashboardMovement[];
};

function getMovementLabel(type: DashboardMovementType) {
  if (type === "STOCK_IN") {
    return "Stock In";
  }

  if (type === "STOCK_OUT") {
    return "Stock Out";
  }

  return "Adjustment";
}

function getMovementTone(type: DashboardMovementType) {
  if (type === "STOCK_IN") {
    return "green" as const;
  }

  if (type === "STOCK_OUT") {
    return "blue" as const;
  }

  return "amber" as const;
}

function getMovementIcon(type: DashboardMovementType) {
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

export function RecentMovements({ movements }: RecentMovementsProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-zinc-950">
            Recent Movements
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Latest inbound, outbound, and adjustment entries.
          </p>
        </div>
        <PackageCheck aria-hidden="true" className="size-5 text-zinc-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        {movements.length > 0 ? (
          movements.map((movement) => (
            <div key={movement.id} className="flex gap-3">
              <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
                {getMovementIcon(movement.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-zinc-950">
                    {movement.product.name}
                  </p>
                  <Badge tone={getMovementTone(movement.type)}>
                    {getMovementLabel(movement.type)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {movement.product.sku} | {formatQuantity(movement.quantity)} units
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {formatMovementDate(movement.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">No stock movements yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
