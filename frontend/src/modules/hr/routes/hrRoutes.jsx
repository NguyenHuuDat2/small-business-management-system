import HrLayout from "../layouts/HrLayout";
import HrDashboardPage from "../pages/dashboard/HrDashboardPage";
import HrEmployeesPage from "../pages/employees/EmployeeListPage";

const hrRoutes = {
  path: "/hr",
  element: <HrLayout />,
  children: [
    {
      path: "dashboard",
      element: <HrDashboardPage />,
    },
    {
      path: "employees",
      element: <EmployeeListPage />,
    },
  ],
};

export default hrRoutes;