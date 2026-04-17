import { useAuth } from "../../../context/AuthContext";

import WorkspacePage from "../../workspace/pages/WorkspacePage";
import SalesDashboardPage from "../../sales/pages/dashboard/SalesDashboardPage";
import WarehouseDashboardPage from "../../warehouse/pages/dashboard/WarehouseDashboardPage";
import AccountingDashboardPage from "../../accounting/pages/dashboard/AccountingDashboardPage";
import HrDashboardPage from "../../hr/pages/dashboard/HrDashboardPage";

function RoleDashboardPage() {
  const { user } = useAuth();

  const roleCode = user?.role?.role_code || user?.role_code || "";

  switch (roleCode) {
    case "SALES":
      return <SalesDashboardPage />;
    case "WAREHOUSE":
      return <WarehouseDashboardPage />;
    case "ACCOUNTANT":
    case "ACCOUNTING":
      return <AccountingDashboardPage />;
    case "HR":
      return <HrDashboardPage />;
    default:
      return <WorkspacePage />;
  }
}

export default RoleDashboardPage;