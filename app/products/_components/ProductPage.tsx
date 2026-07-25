"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "../actions";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { ProductToolbar } from "./ProductToolbar";
import type {
  CategoryOption,
  ProductActionState,
  ProductRow,
} from "@/lib/products/types";
import {
  createProductSchema,
  type CreateProductInput,
} from "@/lib/validations/product";

type ProductPageProps = {
  categories: CategoryOption[];
  products: ProductRow[];
};

const initialProductActionState: ProductActionState = {
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

export function ProductPage({ categories, products }: ProductPageProps) {
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [requestState, setRequestState] = useState<ProductActionState>(
    initialProductActionState,
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
    setRequestState(initialProductActionState);
    clearProductForm();
    setIsFormOpen(true);
  }

  async function createProduct(data: CreateProductInput) {
    setRequestState(initialProductActionState);

    try {
      const result = await createProductAction(data);
      setRequestState(result);

      if (result.ok) {
        clearProductForm();
      }
    } catch {
      setRequestState({
        ok: false,
        message: "Unable to submit the product.",
      });
    }
  }

  async function deleteProduct(productId: string) {
    setDeletingId(productId);
    setError("");

    try {
      const result = await deleteProductAction(productId);

      if (!result.ok) {
        throw new Error(result.message);
      }
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
    setRequestState(initialProductActionState);
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
    setRequestState(initialProductActionState);
    clearProductForm();
    setIsFormOpen(false);
  }

  async function updateProduct(data: CreateProductInput) {
    if (!editingProductId) {
      return;
    }

    setRequestState(initialProductActionState);

    try {
      const result = await updateProductAction(editingProductId, data);
      setRequestState(result);

      if (result.ok) {
        clearProductForm();
        setIsFormOpen(false);
      }
    } catch {
      setRequestState({
        ok: false,
        message: "Unable to submit the product.",
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
        onDeleteProduct={deleteProduct}
        onEditProduct={editProduct}
        products={products}
      />
    </div>
  );
}
