export type CategoryOption = {
  id: string;
  name: string;
};

export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: CategoryOption | null;
  brandId: string | null;
  supplierId: string | null;
  model: string | null;
  quantity: number;
  reorderLevel: number;
  costPrice: string;
  sellingPrice: string;
  warrantyMonths: number | null;
  location: string | null;
  description: string | null;
  isActive: boolean;
};

export type ProductActionState = {
  ok: boolean;
  message: string;
};
