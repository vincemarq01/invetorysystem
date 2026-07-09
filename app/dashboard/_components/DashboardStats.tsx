import {
  AlertCircle,
  Boxes,
  CircleDollarSign,
  PackageX,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStat } from "./dashboard-types";

type DashboardStatsProps = {
  stats: DashboardStat[];
};

const icons = [Boxes, CircleDollarSign, AlertCircle, PackageX];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = icons[index] ?? Boxes;

        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-600">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-950">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium text-zinc-500">
                {stat.detail}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
