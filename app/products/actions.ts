"use server";

import { revalidatePath } from "next/cache";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/products/product-service";
import type { ProductActionState } from "@/lib/products/types";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";

function hasPrismaErrorCode(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function createProductAction(
  input: CreateProductInput,
): Promise<ProductActionState> {
  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid product data.",
    };
  }

  try {
    await createProduct(parsed.data);
    revalidatePath("/products");

    return {
      ok: true,
      message: "Product created successfully.",
    };
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2002")) {
      return {
        ok: false,
        message: "SKU already exists.",
      };
    }

    return {
      ok: false,
      message: "Unable to create product.",
    };
  }
}

export async function updateProductAction(
  productId: string,
  input: CreateProductInput,
): Promise<ProductActionState> {
  if (!productId) {
    return {
      ok: false,
      message: "Product ID is required.",
    };
  }

  const parsed = createProductSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid product data.",
    };
  }

  try {
    await updateProduct(productId, parsed.data);
    revalidatePath("/products");

    return {
      ok: true,
      message: "Product updated successfully.",
    };
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2025")) {
      return {
        ok: false,
        message: "Product not found.",
      };
    }

    if (hasPrismaErrorCode(error, "P2002")) {
      return {
        ok: false,
        message: "SKU already exists.",
      };
    }

    return {
      ok: false,
      message: "Unable to update product.",
    };
  }
}

export async function deleteProductAction(
  productId: string,
): Promise<ProductActionState> {
  if (!productId) {
    return {
      ok: false,
      message: "Product ID is required.",
    };
  }

  try {
    await deleteProduct(productId);
    revalidatePath("/products");

    return {
      ok: true,
      message: "Product deleted successfully.",
    };
  } catch (error) {
    if (hasPrismaErrorCode(error, "P2025")) {
      return {
        ok: false,
        message: "Product not found.",
      };
    }

    return {
      ok: false,
      message: "Unable to delete product.",
    };
  }
}
