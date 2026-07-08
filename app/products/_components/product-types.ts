export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  } | null;
  brandId: string | null;
  supplierId: string | null;
  model: string | null;
  quantity: number;
  reorderLevel: number;
  costPrice: string | number;
  sellingPrice: string | number;
  warrantyMonths: number | null;
  location: string | null;
  description: string | null;
  isActive: boolean;
};

export type ProductRequestState = {
  ok: boolean;
  message: string;
};
