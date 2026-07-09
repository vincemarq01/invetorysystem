export type DashboardStat = {
  label: string;
  value: string;
  detail: string;
};

export type DashboardProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  value: number;
};

export type DashboardMovementType = "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT";

export type DashboardMovement = {
  id: string;
  type: DashboardMovementType;
  quantity: number;
  note: string | null;
  createdAt: string;
  product: {
    name: string;
    sku: string;
  };
};

export type DashboardCategory = {
  name: string;
  products: number;
  quantity: number;
  value: number;
};

export type DashboardData = {
  stats: DashboardStat[];
  priorityProducts: DashboardProduct[];
  recentMovements: DashboardMovement[];
  categories: DashboardCategory[];
};
