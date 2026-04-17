import RoleDashboardPage from "../../modules/dashboard/pages/RoleDashboardPage";
import WorkspacePage from "../../modules/workspace/pages/WorkspacePage";

import HrDashboardPage from "../../modules/hr/pages/dashboard/HrDashboardPage";
import EmployeeListPage from "../../modules/hr/pages/employees/EmployeeListPage";

import SalesDashboardPage from "../../modules/sales/pages/dashboard/SalesDashboardPage";
import SalesOrderListPage from "../../modules/sales/pages/orders/SalesOrderListPage";
import SalesOrderCreatePage from "../../modules/sales/pages/orders/SalesOrderCreatePage";
import SalesOrderDetailPage from "../../modules/sales/pages/orders/SalesOrderDetailPage";
import CustomerListPage from "../../modules/sales/pages/customers/CustomerListPage";
import ProductListPage from "../../modules/sales/pages/products/ProductListPage";
import SalesReportPage from "../../modules/sales/pages/reports/SalesReportPage";

import WarehouseDashboardPage from "../../modules/warehouse/pages/dashboard/WarehouseDashboardPage";
import InventoryPage from "../../modules/warehouse/pages/inventory/InventoryPage";
import GoodsReceiptPage from "../../modules/warehouse/pages/receipts/GoodsReceiptPage";
import DeliveryPage from "../../modules/warehouse/pages/deliveries/DeliveryPage";

import AccountingDashboardPage from "../../modules/accounting/pages/dashboard/AccountingDashboardPage";
import InvoiceListPage from "../../modules/accounting/pages/invoices/InvoiceListPage";
import PaymentListPage from "../../modules/accounting/pages/payments/PaymentListPage";
import ReceivableListPage from "../../modules/accounting/pages/receivables/ReceivableListPage";

import PlaceholderPage from "../../shared/components/ui/PlaceholderPage";

const pageRegistryByCode = {
  "workspace.index": RoleDashboardPage,

  "hr.dashboard.index": HrDashboardPage,
  "hr.employees.index": EmployeeListPage,

  "sales.dashboard.index": SalesDashboardPage,
  "sales.orders.index": SalesOrderListPage,
  "sales.orders.create": SalesOrderCreatePage,
  "sales.orders.detail": SalesOrderDetailPage,
  "sales.customers.index": CustomerListPage,
  "sales.products.index": ProductListPage,
  "sales.reports.index": SalesReportPage,

  "warehouse.dashboard.index": WarehouseDashboardPage,
  "warehouse.inventory.index": InventoryPage,
  "warehouse.receipts.index": GoodsReceiptPage,
  "warehouse.deliveries.index": DeliveryPage,

  "accounting.dashboard.index": AccountingDashboardPage,
  "accounting.invoices.index": InvoiceListPage,
  "accounting.payments.index": PaymentListPage,
  "accounting.receivables.index": ReceivableListPage,
};

const pageRegistryByPath = {
  "/": RoleDashboardPage,
  "/dashboard": RoleDashboardPage,
  "/workspace": WorkspacePage,

  // HR
  "/hr/dashboard": HrDashboardPage,
  "/employees": EmployeeListPage,

  // SALES
  "/sales/dashboard": SalesDashboardPage,
  "/sales-orders": SalesOrderListPage,
  "/sales-orders/create": SalesOrderCreatePage,
  "/customers": CustomerListPage,

  // hỗ trợ cả path mới và path cũ
  "/sales-products": ProductListPage,
  "/sales-reports": SalesReportPage,
  "/sales/products": ProductListPage,
  "/sales/reports": SalesReportPage,

  // WAREHOUSE - hỗ trợ cả 2 kiểu path
  "/warehouse/dashboard": WarehouseDashboardPage,
  "/warehouse/receipts": GoodsReceiptPage,
  "/warehouse/deliveries": DeliveryPage,
  "/warehouse/inventory": InventoryPage,
  "/goods-receipts": GoodsReceiptPage,
  "/deliveries": DeliveryPage,
  "/inventory": InventoryPage,

  // ACCOUNTING - hỗ trợ cả 2 kiểu path
  "/accounting/dashboard": AccountingDashboardPage,
  "/accounting/invoices": InvoiceListPage,
  "/accounting/payments": PaymentListPage,
  "/accounting/receivables": ReceivableListPage,
  "/invoices": InvoiceListPage,
  "/payments": PaymentListPage,
  "/receivables": ReceivableListPage,
};

export function resolvePageComponent(menu) {
  if (menu?.page_code && pageRegistryByCode[menu.page_code]) {
    return pageRegistryByCode[menu.page_code];
  }

  if (menu?.path && pageRegistryByPath[menu.path]) {
    return pageRegistryByPath[menu.path];
  }

  if (import.meta.env.DEV) {
    console.warn("Không tìm thấy page component cho menu:", menu);
  }

  return PlaceholderPage;
}