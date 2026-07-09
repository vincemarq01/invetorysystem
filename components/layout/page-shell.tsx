import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

type PageShellProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function PageShell({
  children,
  title,
  description,
  actions,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <AppHeader />
        <main className="px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">
                {title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                {description}
              </p>
            </div>
            {actions ? (
              <div className="flex flex-wrap gap-2">{actions}</div>
            ) : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
