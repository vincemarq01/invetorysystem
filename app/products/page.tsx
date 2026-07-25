import { connection } from "next/server";
import { PageShell } from "@/components/layout/page-shell";
import {
  getCategoryOptions,
  getProducts,
} from "@/lib/products/product-service";
import { ProductPage } from "./_components/ProductPage";

export default async function ProductsPage() {
  await connection();

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategoryOptions(),
  ]);

  return (
    <PageShell>
      <ProductPage categories={categories} products={products} />
    </PageShell>
  );
}
