"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { ProductToolbar } from "./ProductToolbar";
import type { ProductRequestState, ProductRow } from "./product-types";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";

type ProductsResponse = {
  products?: ProductRow[];
  message?: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

type CategoriesResponse = {
  categories?: CategoryOption[];
  message?: string;
};

const initialProductRequestState: ProductRequestState = {
  ok: false,
  message: "",
};

const emptyProductForm: CreateProductInput = {
  name: "",
  sku: "",
  categoryId: "",
  brandId: "",
  supplierId: "",
  model: "",
  quantity: 0,
  reorderLevel: 10,
  costPrice: 0,
  sellingPrice: 0,
  warrantyMonths: undefined,
  location: "",
  description: "",
};

export function ProductPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [requestState, setRequestState] = useState<ProductRequestState>(
    initialProductRequestState,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyProductForm,
  });

  function clearProductForm() {
    setEditingProductId(null);
    reset(emptyProductForm);
  }

  function startAddingProduct() {
    setRequestState(initialProductRequestState);
    clearProductForm();
    setIsFormOpen(true);
  }

  async function loadProducts() {
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const result = (await response.json()) as ProductsResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to fetch products.");
      }

      setProducts(result.products ?? []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to fetch products.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const response = await fetch("/api/categories", { cache: "no-store" });
      const result = (await response.json()) as CategoriesResponse;

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to fetch categories.");
      }

      setCategories(result.categories ?? []);
      setCategoryError("");
    } catch (loadError) {
      setCategoryError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to fetch categories.",
      );
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      await Promise.all([loadProducts(), loadCategories()]);
    }

    void loadInitialData();
  }, []);

  async function createProduct(data: CreateProductInput) {
    setRequestState(initialProductRequestState);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };

      setRequestState({
        ok: response.ok,
        message: result.message ?? "Product request completed.",
      });

      if (response.ok) {
        clearProductForm();
        await loadProducts();
      }
    } catch {
      setRequestState({
        ok: false,
        message: "Unable to connect to products API.",
      });
    }
  }

  async function deleteProduct(productId: string) {
    setDeletingId(productId);
    setError("");

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to delete product.");
      }

      await loadProducts();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function editProduct(product: ProductRow) {
    setEditingProductId(product.id);
    setIsFormOpen(true);
    setRequestState(initialProductRequestState);
    reset({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId ?? "",
      brandId: product.brandId ?? "",
      supplierId: product.supplierId ?? "",
      model: product.model ?? "",
      quantity: product.quantity,
      reorderLevel: product.reorderLevel,
      costPrice: Number(product.costPrice),
      sellingPrice: Number(product.sellingPrice),
      warrantyMonths: product.warrantyMonths ?? undefined,
      location: product.location ?? "",
      description: product.description ?? "",
    });
  }

  function cancelEdit() {
    setRequestState(initialProductRequestState);
    clearProductForm();
    setIsFormOpen(false);
  }

  async function updateProduct(data: CreateProductInput) {
    if (!editingProductId) {
      return;
    }

    setRequestState(initialProductRequestState);

    try {
      const response = await fetch(`/api/products/${editingProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };

      setRequestState({
        ok: response.ok,
        message: result.message ?? "Product request completed.",
      });

      if (response.ok) {
        clearProductForm();
        setIsFormOpen(false);
        await loadProducts();
      }
    } catch {
      setRequestState({
        ok: false,
        message: "Unable to connect to products API.",
      });
    }
  }

  return (
    <div className="grid gap-5">
      <ProductToolbar onAddProduct={startAddingProduct} />

      {isFormOpen ? (
        <ProductForm
          editingProductId={editingProductId}
          categories={categories}
          categoryError={categoryError}
          errors={errors}
          isSubmitting={isSubmitting}
          onCancel={cancelEdit}
          onSubmit={handleSubmit(
            editingProductId ? updateProduct : createProduct,
          )}
          register={register}
          requestState={requestState}
        />
      ) : null}

      <ProductTable
        deletingId={deletingId}
        error={error}
        isLoading={isLoading}
        onDeleteProduct={deleteProduct}
        onEditProduct={editProduct}
        products={products}
      />
    </div>
  );
}
