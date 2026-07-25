import { prisma } from "@/lib/prisma";
import type { CreateProductInput } from "@/lib/validations/product";
import type { CategoryOption, ProductRow } from "./types";

function toProductData(productData: CreateProductInput) {
  return {
    name: productData.name,
    sku: productData.sku.toUpperCase(),
    categoryId: productData.categoryId,
    brandId: productData.brandId || null,
    supplierId: productData.supplierId || null,
    model: productData.model || null,
    quantity: productData.quantity,
    reorderLevel: productData.reorderLevel,
    costPrice: productData.costPrice,
    sellingPrice: productData.sellingPrice,
    warrantyMonths: productData.warrantyMonths ?? null,
   location: productData.location || null,
    description: productData.description || null,
  };
}

export async function getProducts(): Promise<ProductRow[]> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
        }
      : null,
    brandId: product.brandId,
    supplierId: product.supplierId,
    model: product.model,
    quantity: product.quantity,
    reorderLevel: product.reorderLevel,
    costPrice: product.costPrice.toString(),
    sellingPrice: product.sellingPrice.toString(),
    warrantyMonths: product.warrantyMonths,
    location: product.location,
    description: product.description,
    isActive: product.isActive,
  }));
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function createProduct(productData: CreateProductInput) {
  await prisma.product.create({
    data: toProductData(productData),
  });
}

export async function updateProduct(
  productId: string,
  productData: CreateProductInput,
) {
  await prisma.product.update({
    where: { id: productId },
    data: toProductData(productData),
  });
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: { id: productId },
  });
}
