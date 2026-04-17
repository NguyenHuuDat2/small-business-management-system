import { Navigate, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { findFirstPath } from "../../shared/utils/routeHelpers";
import PageLoader from "../../shared/components/feedback/PageLoader";
import { renderDynamicRoutes } from "./DynamicRoutes";
import LoginPage from "../../modules/auth/pages/LoginPage";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../../shared/components/ui/ProtectedRoute";

import SalesOrderCreatePage from "../../modules/sales/pages/orders/SalesOrderCreatePage";
import SalesOrderDetailPage from "../../modules/sales/pages/orders/SalesOrderDetailPage";

function AppRouter() {
  const { isAuthenticated, sidebar, loading } = useAuth();

  const defaultPath = useMemo(() => {
    return isAuthenticated ? findFirstPath(sidebar) || "/workspace" : "/login";
  }, [isAuthenticated, sidebar]);

  const routesReady = !isAuthenticated || (Array.isArray(sidebar) && sidebar.length > 0);

  if (loading || !routesReady) {
    return <PageLoader text="Đang tải hệ thống..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dynamic routes từ sidebar/menu DB */}
      {renderDynamicRoutes(sidebar)}

      {/* Static sub-routes cho Sales Order */}
      <Route
        path="/sales-orders/create"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalesOrderCreatePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales-orders/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalesOrderDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export default AppRouter;