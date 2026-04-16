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
import ProductPage from "../../modules/warehouse/pages/products/ProductPage";


export const pageRegistry = {
  "workspace.index": WorkspacePage,

  "hr.dashboard.index": HrDashboardPage,
  "hr.employees.index": EmployeeListPage,

  "sales.dashboard.index": SalesDashboardPage,
  "sales.orders.index": SalesOrderListPage,
  "sales.customers.index": CustomerListPage,

  "/warehouse/products": ProductPage,
  "warehouse.dashboard.index": WarehouseDashboardPage,
  "warehouse.inventory.index": InventoryPage,
  "warehouse.receipts.index": GoodsReceiptPage,
  "warehouse.deliveries.index": DeliveryPage,

  "accounting.dashboard.index": AccountingDashboardPage,
  "accounting.invoices.index": InvoiceListPage,
  "accounting.payments.index": PaymentListPage,
  "accounting.receivables.index": ReceivableListPage,
};

export function resolvePageComponent(menu) {
  return pageRegistry[menu?.page_code] || PlaceholderPage;
}