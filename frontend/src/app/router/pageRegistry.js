import WorkspacePage from "../../modules/workspace/pages/WorkspacePage";

import HrDashboardPage from "../../modules/hr/pages/dashboard/HrDashboardPage";
import EmployeeListPage from "../../modules/hr/pages/employees/EmployeeListPage";

import SalesDashboardPage from "../../modules/sales/pages/dashboard/SalesDashboardPage";
import SalesOrderListPage from "../../modules/sales/pages/orders/SalesOrderListPage";
import CustomerListPage from "../../modules/sales/pages/customers/CustomerListPage";

import WarehouseDashboardPage from "../../modules/warehouse/pages/dashboard/WarehouseDashboardPage";
import InventoryPage from "../../modules/warehouse/pages/inventory/InventoryPage";
import GoodsReceiptPage from "../../modules/warehouse/pages/receipts/GoodsReceiptPage";
import DeliveryPage from "../../modules/warehouse/pages/deliveries/DeliveryPage";

import AccountingDashboardPage from "../../modules/accounting/pages/dashboard/AccountingDashboardPage";
import InvoiceListPage from "../../modules/accounting/pages/invoices/InvoiceListPage";
import PaymentListPage from "../../modules/accounting/pages/payments/PaymentListPage";
import ReceivableListPage from "../../modules/accounting/pages/receivables/ReceivableListPage";

import PlaceholderPage from "../../shared/components/ui/PlaceholderPage";

export const pageRegistry = {
  "workspace.index": WorkspacePage,

  "hr.dashboard.index": HrDashboardPage,
  "hr.employees.index": EmployeeListPage,

  "sales.dashboard.index": SalesDashboardPage,
  "sales.orders.index": SalesOrderListPage,
  "sales.customers.index": CustomerListPage,

  "warehouse.dashboard.index": WarehouseDashboardPage,
  "warehouse.inventory.index": InventoryPage,
  "warehouse.receipts.index": GoodsReceiptPage,
  "warehouse.deliveries.index": DeliveryPage,

  "accounting.dashboard.index": AccountingDashboardPage,
  "accounting.invoices.index": InvoiceListPage,
  "accounting.payments.index": PaymentListPage,
  "accounting.receivables.index": ReceivableListPage,
};

const pageAliases = {
  "workspace": "workspace.index",

  "hr.dashboard": "hr.dashboard.index",
  "hr.employees": "hr.employees.index",

  "sales.dashboard": "sales.dashboard.index",
  "sales.orders": "sales.orders.index",
  "sales.customers": "sales.customers.index",

  "warehouse.dashboard": "warehouse.dashboard.index",
  "warehouse.inventory": "warehouse.inventory.index",
  "warehouse.receipts": "warehouse.receipts.index",
  "warehouse.deliveries": "warehouse.deliveries.index",

  "accounting.dashboard": "accounting.dashboard.index",
  "accounting.invoices": "accounting.invoices.index",
  "accounting.payments": "accounting.payments.index",
  "accounting.receivables": "accounting.receivables.index",
};

const pathRegistry = {
  "/workspace": WorkspacePage,

  "/hr/dashboard": HrDashboardPage,
  "/hr/employees": EmployeeListPage,

  "/sales/dashboard": SalesDashboardPage,
  "/sales/orders": SalesOrderListPage,
  "/sales/customers": CustomerListPage,

  "/warehouse/dashboard": WarehouseDashboardPage,
  "/warehouse/inventory": InventoryPage,
  "/warehouse/receipts": GoodsReceiptPage,
  "/warehouse/deliveries": DeliveryPage,

  "/accounting/dashboard": AccountingDashboardPage,
  "/accounting/invoices": InvoiceListPage,
  "/accounting/payments": PaymentListPage,
  "/accounting/receivables": ReceivableListPage,
};

function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function normalizeMenuPath(path) {
  const normalized = normalizeText(path);

  if (!normalized) return "";
  if (normalized === "/") return "/";

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`;

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;
}

function normalizePageCode(pageCode) {
  const normalized = normalizeText(pageCode);
  if (!normalized) return "";

  return pageAliases[normalized] || normalized;
}

function pageCodeFromPermission(permissionKey) {
  const normalized = normalizeText(permissionKey);
  if (!normalized) return "";

  if (normalized.endsWith(".view")) {
    return normalized.replace(/\.view$/, ".index");
  }

  return "";
}

const normalizedPageRegistry = Object.fromEntries(
  Object.entries(pageRegistry).map(([key, component]) => [
    normalizeText(key),
    component,
  ])
);

const normalizedPathRegistry = Object.fromEntries(
  Object.entries(pathRegistry).map(([key, component]) => [
    normalizeMenuPath(key),
    component,
  ])
);

export function resolvePageComponent(menu) {
  const canonicalPageCode = normalizePageCode(menu?.page_code);
  const fallbackPageCode = pageCodeFromPermission(menu?.permission_key);
  const normalizedPath = normalizeMenuPath(menu?.path);

  return (
    normalizedPageRegistry[canonicalPageCode] ||
    normalizedPageRegistry[fallbackPageCode] ||
    normalizedPathRegistry[normalizedPath] ||
    PlaceholderPage
  );
}