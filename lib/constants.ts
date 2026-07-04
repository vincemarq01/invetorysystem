import {
  BarChart3,
  Boxes,
  Home,
  Settings,
  Truck,
  Warehouse,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Products", href: "/products", icon: Boxes },
  { label: "Stock", href: "/stock", icon: Warehouse },
  { label: "Suppliers", href: "/suppliers", icon: Truck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const quickFilters = ["All", "Low Stock", "Out of Stock", "In Stock"];

export const chartLegend = [
  { label: "Stock in", color: "bg-emerald-500" },
  { label: "Stock out", color: "bg-cyan-500" },
  { label: "Adjustments", color: "bg-amber-500" },
];

export const dashboardIcon = BarChart3;
