import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import type {
  DashboardCategory,
  DashboardData,
  DashboardMovement,
  DashboardMovementType,
  DashboardProduct,
} from "../_components/dashboard-types";

type RecentMovementRecord = {
  id: string;
  type: DashboardMovementType;
  quantity: number;
  note: string | null;
  createdAt: Date;
  product: {
    name: string;
    sku: string;
  };
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-PH").format(value);
}

function toMoneyValue(value: unknown) {
  return Number(value) || 0;
}

function getStockStatus(product: { quantity: number; reorderLevel: number }) {
  if (product.quantity === 0) {
    return "Out of stock";
  }

  if (product.quantity <= product.reorderLevel) {
    return "Low stock";
  }

  return "Healthy";
}

function buildPriorityProducts(
  products: Array<{
    id: string;
    name: string;
    sku: string;
    quantity: number;
    reorderLevel: number;
    costPrice: unknown;
    category: { name: string } | null;
  }>,
): DashboardProduct[] {
  return products
    .filter((product) => getStockStatus(product) !== "Healthy")
    .sort((first, second) => {
      if (first.quantity === 0 && second.quantity !== 0) {
        return -1;
      }

      if (first.quantity !== 0 && second.quantity === 0) {
        return 1;
      }

      return (
        first.quantity - first.reorderLevel - (second.quantity - second.reorderLevel)
      );
    })
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category: product.category?.name ?? "Uncategorized",
      quantity: product.quantity,
      reorderLevel: product.reorderLevel,
      value: product.quantity * toMoneyValue(product.costPrice),
    }));
}

function buildCategorySummary(
  products: Array<{
    quantity: number;
    costPrice: unknown;
    category: { name: string } | null;
  }>,
): DashboardCategory[] {
  const categories = new Map<string, DashboardCategory>();

  for (const product of products) {
    const name = product.category?.name ?? "Uncategorized";
    const current = categories.get(name) ?? {
      name,
      products: 0,
      quantity: 0,
      value: 0,
    };

    current.products += 1;
    current.quantity += product.quantity;
    current.value += product.quantity * toMoneyValue(product.costPrice);
    categories.set(name, current);
  }

  return Array.from(categories.values())
    .sort((first, second) => second.value - first.value)
    .slice(0, 6);
}

function mapMovement(movement: RecentMovementRecord): DashboardMovement {
  return {
    id: movement.id,
    type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    createdAt: movement.createdAt.toISOString(),
    product: {
      name: movement.product.name,
      sku: movement.product.sku,
    },
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [products, recentMovements, weeklyMovements] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        type: true,
        quantity: true,
      },
    }),
  ]);

  const totalProducts = products.length;
  const inventoryValue = products.reduce(
    (sum, product) => sum + product.quantity * toMoneyValue(product.costPrice),
    0,
  );
  const lowStockCount = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel,
  ).length;
  const outOfStockCount = products.filter((product) => product.quantity === 0).length;
  const weeklyStockIn = weeklyMovements
    .filter((movement) => movement.type === "STOCK_IN")
    .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);
  const weeklyStockOut = weeklyMovements
    .filter((movement) => movement.type === "STOCK_OUT")
    .reduce((sum, movement) => sum + Math.abs(movement.quantity), 0);

  return {
    stats: [
      {
        label: "Total products",
        value: formatNumber(totalProducts),
        detail: `${formatNumber(products.reduce((sum, product) => sum + product.quantity, 0))} units on hand`,
      },
      {
        label: "Inventory value",
        value: formatCurrency(inventoryValue),
        detail: "Based on cost price",
      },
      {
        label: "Low stock",
        value: formatNumber(lowStockCount),
        detail: "At or below reorder level",
      },
      {
        label: "Out of stock",
        value: formatNumber(outOfStockCount),
        detail: `${formatNumber(weeklyStockIn)} in / ${formatNumber(weeklyStockOut)} out this week`,
      },
    ],
    priorityProducts: buildPriorityProducts(products),
    recentMovements: recentMovements.map(mapMovement),
    categories: buildCategorySummary(products),
  };
}
