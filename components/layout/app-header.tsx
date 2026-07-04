import { Bell, CalendarDays, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/shared/search-field";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-stone-50/90 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          className="grid size-10 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 lg:hidden"
          aria-label="Open menu"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <div className="hidden flex-1 md:block">
          <SearchField placeholder="Search products, SKU, suppliers" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" className="hidden sm:inline-flex">
            <CalendarDays aria-hidden="true" className="size-4" />
            July 2026
          </Button>
          <button
            className="grid size-10 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
            aria-label="Notifications"
          >
            <Bell aria-hidden="true" className="size-4" />
          </button>
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">New item</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
