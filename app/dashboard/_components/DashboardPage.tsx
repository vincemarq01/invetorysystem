import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, PackagePlus } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { getDashboardData } from "../_services/dashboard-service";
import { CategorySummary } from "./CategorySummary";
import { DashboardStats } from "./DashboardStats";
import { PriorityStockTable } from "./PriorityStockTable";
import { RecentMovements } from "./RecentMovements";

const actionClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors";

export async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <PageShell
      title="Dashboard"
      description="Monitor stock health, urgent replenishments, and recent warehouse activity."
      actions={
        <>
          <Link
            className={`${actionClassName} border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100`}
            href="/products"
          >
            <PackagePlus aria-hidden="true" className="size-4" />
            Add Product
          </Link>
          <Link
            className={`${actionClassName} border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100`}
            href="/stock"
          >
            <ArrowDownRight aria-hidden="true" className="size-4" />
            Stock Out
          </Link>
          <Link
            className={`${actionClassName} bg-zinc-950 text-white hover:bg-zinc-800`}
            href="/stock"
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
            Stock In
          </Link>
        </>
      }
    >
      <DashboardStats stats={dashboard.stats} />

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <PriorityStockTable products={dashboard.priorityProducts} />
        <RecentMovements movements={dashboard.recentMovements} />
      </div>

      <div className="mt-5">
        <CategorySummary categories={dashboard.categories} />
      </div>
    </PageShell>
  );
}
