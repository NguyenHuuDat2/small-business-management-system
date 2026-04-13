import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { findFirstPath } from "../../shared/utils/routeHelpers";
import PageLoader from "../../shared/components/feedback/PageLoader";
import { renderDynamicRoutes } from "./DynamicRoutes";
import LoginPage from "../../modules/auth/pages/LoginPage";

function AppRouter() {
  const { isAuthenticated, sidebar, loading } = useAuth();

  const defaultPath = isAuthenticated
    ? findFirstPath(sidebar) || "/workspace"
    : "/login";

    if (loading) {
    return <PageLoader text="Đang tải hệ thống..." />;
    }
    
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<LoginPage />} />
      {renderDynamicRoutes(sidebar)}
      <Route path="*" element={<Navigate to={defaultPath} replace />} />
    </Routes>
  );
}

export default AppRouter;