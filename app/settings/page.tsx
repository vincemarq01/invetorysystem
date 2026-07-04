import { Bell, Building2, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/layout/page-shell";

const settingsGroups = [
  {
    title: "Company Profile",
    description: "Warehouse identity and operating details.",
    icon: Building2,
  },
  {
    title: "Stock Rules",
    description: "Reorder alerts, SKU format, and movement defaults.",
    icon: SlidersHorizontal,
  },
  {
    title: "Notifications",
    description: "Low stock alerts and daily movement summaries.",
    icon: Bell,
  },
  {
    title: "Permissions",
    description: "Role-based access placeholder for future auth.",
    icon: ShieldCheck,
  },
];

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Frontend-only settings surface for inventory preferences and future access controls."
      actions={<Button>Save changes</Button>}
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Inventory Defaults</h2>
              <p className="mt-1 text-sm text-zinc-500">Static fields for the first UI pass.</p>
            </div>
            <Badge tone="blue">Mock only</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Warehouse name</span>
              <Input defaultValue="Main Warehouse" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Default currency</span>
              <Input defaultValue="PHP" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">Low stock threshold</span>
              <Input defaultValue="20" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-zinc-700">SKU prefix</span>
              <Input defaultValue="INV" />
            </label>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {settingsGroups.map((group) => {
            const Icon = group.icon;

            return (
              <Card key={group.title}>
                <CardContent className="flex gap-3 p-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-md bg-zinc-100">
                    <Icon aria-hidden="true" className="size-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-950">{group.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{group.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
