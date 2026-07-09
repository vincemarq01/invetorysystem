"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, PanelLeftClose } from "lucide-react";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
        <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-zinc-950 text-white">
              <Boxes aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-950">
                Stockmoto
              </span>
              <span className="block text-xs text-zinc-500">Inventory</span>
            </span>
          </Link>
          <button
            className="grid size-9 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose aria-hidden="true" className="size-4" />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition",
                  isActive
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-zinc-200 bg-white px-2 py-2 shadow-lg shadow-zinc-950/10 lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-2 text-xs font-medium transition",
                isActive
                  ? "bg-zinc-950 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
