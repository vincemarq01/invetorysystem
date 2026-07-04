export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  supplier: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  status: ProductStatus;
  location: string;
};
