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

  // Backward-compatible aliases for older menu seeds
  "accounting.dashboard": AccountingDashboardPage,
  "accounting.invoice.index": InvoiceListPage,
  "accounting.payment.index": PaymentListPage,
  "accounting.receivable.index": ReceivableListPage,
};

const permissionRegistry = {
  "accounting.dashboard.view": AccountingDashboardPage,
  "accounting.invoices.view": InvoiceListPage,
  "accounting.payments.view": PaymentListPage,
  "accounting.receivables.view": ReceivableListPage,
};

const pathRegistry = {
  "/accounting/dashboard": AccountingDashboardPage,
  "/accounting/invoices": InvoiceListPage,
  "/accounting/payments": PaymentListPage,
  "/accounting/receivables": ReceivableListPage,
};

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePath(path) {
  const normalized = String(path || "").trim();
  if (!normalized) return "";
  return normalized.replace(/\/+$/, "").toLowerCase();
}

export function resolvePageComponent(menu) {
  const pageCode = normalizeKey(menu?.page_code);
  const permissionKey = normalizeKey(menu?.permission_key);
  const path = normalizePath(menu?.path);

  return (
    pageRegistry[pageCode] ||
    permissionRegistry[permissionKey] ||
    pathRegistry[path] ||
    PlaceholderPage
  );
}
