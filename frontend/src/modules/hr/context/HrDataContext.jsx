import { createContext, useContext, useEffect, useMemo, useState } from "react";
import dashboardService from "../services/dashboardService";
import employeeService from "../services/employeeService";
import departmentService from "../services/departmentService";
import { useAuth } from "../../../context/AuthContext";

const HrDataContext = createContext(null);

export function HrDataProvider({ children }) {
  const { loading: authLoading, isAuthenticated } = useAuth();

  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState("");

  const [dashboard, setDashboard] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [departments, setDepartments] = useState([]);

  const loadHrBootstrap = async (force = false) => {
    if (!force && dashboard && employees && departments.length > 0) {
      setBootstrapping(false);
      return;
    }

    try {
      setError("");
      setBootstrapping(true);

      const [dashboardRes, employeesRes, departmentsRes] = await Promise.all([
        dashboardService.getHrDashboard(),
        employeeService.getList({ page: 1, per_page: 10 }),
        departmentService.getList(),
      ]);

      setDashboard(dashboardRes.data?.data ?? null);
      setEmployees(employeesRes.data?.data ?? null);
      setDepartments(departmentsRes.data?.data ?? []);
    } catch (err) {
      setError("Không tải được dữ liệu nhân sự");
      console.error("HR bootstrap error:", err.response?.status, err.response?.data);
    } finally {
      setBootstrapping(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setBootstrapping(false);
      return;
    }

    loadHrBootstrap();
  }, [authLoading, isAuthenticated]);

  const value = useMemo(
    () => ({
      bootstrapping,
      error,
      dashboard,
      employees,
      departments,
      setDashboard,
      setEmployees,
      setDepartments,
      reloadHrData: () => loadHrBootstrap(true),
    }),
    [bootstrapping, error, dashboard, employees, departments]
  );

  return <HrDataContext.Provider value={value}>{children}</HrDataContext.Provider>;
}

export function useHrData() {
  const context = useContext(HrDataContext);
  if (!context) {
    throw new Error("useHrData phải được dùng trong HrDataProvider");
  }
  return context;
}