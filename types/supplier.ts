export type SupplierStatus = "Active" | "Review" | "Paused";

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: number;
  leadTime: string;
  status: SupplierStatus;
};
