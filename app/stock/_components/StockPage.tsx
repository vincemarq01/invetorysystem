"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PageShell } from "@/components/layout/page-shell";
import {
  createStockMovementSchema,
  type CreateStockMovementInput,
} from "@/lib/validations/stock";
import {
  createStockMovement,
  fetchStockMovements,
  fetchStockProducts,
} from "../_services/stock-service";
import { StockMovementForm } from "./StockMovementForm";
import { StockMovementTable } from "./StockMovementTable";
import type {
  StockMovementRow,
  StockProductOption,
  StockRequestState,
} from "./stock-types";

const initialRequestState: StockRequestState = {
  ok: false,
  message: "",
};

const emptyStockMovementForm: CreateStockMovementInput = {
  productId: "",
  type: "STOCK_IN",
  quantity: 1,
  note: "",
};

export function StockPage() {
  const [products, setProducts] = useState<StockProductOption[]>([]);
  const [movements, setMovements] = useState<StockMovementRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [requestState, setRequestState] =
    useState<StockRequestState>(initialRequestState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStockMovementInput>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: emptyStockMovementForm,
  });

  async function loadStockData() {
    try {
      const [nextProducts, nextMovements] = await Promise.all([
        fetchStockProducts(),
        fetchStockMovements(),
      ]);

      setProducts(nextProducts);
      setMovements(nextMovements);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load stock data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialStockData() {
      await loadStockData();
    }

    void loadInitialStockData();
  }, []);

  async function submitMovement(data: CreateStockMovementInput) {
    setRequestState(initialRequestState);

    try {
      const result = await createStockMovement(data);

      setRequestState(result);

      if (result.ok) {
        reset(emptyStockMovementForm);
        await loadStockData();
      }
    } catch {
      setRequestState({
        ok: false,
        message: "Unable to connect to stock movement API.",
      });
    }
  }

  return (
    <PageShell
      title="Stock Movements"
      description="Track inbound items, outbound releases, and inventory adjustments."
    >
      <div className="grid gap-5">
        <StockMovementForm
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(submitMovement)}
          products={products}
          register={register}
          requestState={requestState}
        />

        <StockMovementTable
          error={error}
          isLoading={isLoading}
          movements={movements}
        />
      </div>
    </PageShell>
  );
}
