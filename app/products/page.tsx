import { PageShell } from "@/components/layout/page-shell";
import { ProductPage } from "./_components/ProductPage";

export default async function ProductsPage() {
  return (
    <PageShell>
      <ProductPage />
    </PageShell>
  );
}
