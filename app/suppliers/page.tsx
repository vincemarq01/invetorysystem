import { Mail, Phone, Plus, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { SearchField } from "@/components/shared/search-field";
import { PageShell } from "@/components/layout/page-shell";
import { suppliers } from "@/lib/mock-data";
import type { SupplierStatus } from "@/types/supplier";

function supplierTone(status: SupplierStatus) {
  if (status === "Active") return "green";
  if (status === "Review") return "amber";
  return "zinc";
}

export default function SuppliersPage() {
  return (
    <PageShell
      title="Suppliers"
      description="Review vendor contacts, product coverage, and expected lead times."
      actions={
        <Button>
          <Plus aria-hidden="true" className="size-4" />
          Add supplier
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader className="flex-col items-stretch sm:flex-row sm:items-center">
            <SearchField placeholder="Search suppliers" />
            <Button variant="secondary">
              <Truck aria-hidden="true" className="size-4" />
              Vendor list
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              headers={["Supplier", "Contact", "Products", "Lead time", "Status"]}
              rows={suppliers.map((supplier) => [
                <span key="name" className="font-medium text-zinc-950">
                  {supplier.name}
                </span>,
                supplier.contact,
                supplier.products,
                supplier.leadTime,
                <Badge key="status" tone={supplierTone(supplier.status)}>
                  {supplier.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Key Contacts</h2>
              <p className="mt-1 text-sm text-zinc-500">Fast access for purchasing.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {suppliers.slice(0, 3).map((supplier) => (
              <div key={supplier.id} className="rounded-lg border border-zinc-100 p-3">
                <p className="font-medium text-zinc-950">{supplier.contact}</p>
                <p className="mt-1 text-sm text-zinc-500">{supplier.name}</p>
                <div className="mt-3 space-y-2 text-sm text-zinc-600">
                  <p className="flex items-center gap-2">
                    <Mail aria-hidden="true" className="size-4 text-zinc-400" />
                    {supplier.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone aria-hidden="true" className="size-4 text-zinc-400" />
                    {supplier.phone}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
