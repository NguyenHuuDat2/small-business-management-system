import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../../shared/components/ui/ProtectedRoute";
import { flattenSidebar } from "../../shared/utils/menuTree";
import { normalizeMenuPath, resolvePageComponent } from "./pageRegistry";
import PlaceholderPage from "../../shared/components/ui/PlaceholderPage";

export function renderDynamicRoutes(sidebar = []) {
  const flatMenus = flattenSidebar(sidebar);

  return flatMenus.map((menu) => {
    const normalizedPath = normalizeMenuPath(menu?.path);

    if (!normalizedPath) {
      return null;
    }

    const PageComponent = resolvePageComponent(menu);

    const content =
      PageComponent === PlaceholderPage ? (
        <PlaceholderPage title={menu.name} />
      ) : (
        <PageComponent menu={menu} />
      );

    return (
      <Route
        key={normalizedPath}
        path={normalizedPath}
        element={
          <ProtectedRoute>
            <MainLayout>{content}</MainLayout>
          </ProtectedRoute>
        }
      />
    );
  });
}