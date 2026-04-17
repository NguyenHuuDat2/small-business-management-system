import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../../shared/components/ui/ProtectedRoute";
import { flattenSidebar } from "../../shared/utils/menuTree";
import { resolvePageComponent } from "./pageRegistry";
import PlaceholderPage from "../../shared/components/ui/PlaceholderPage";

export function renderDynamicRoutes(sidebar = []) {
  const flatMenus = flattenSidebar(sidebar);
  const uniquePaths = new Set();

  return flatMenus
    .filter((menu) => {
      if (!menu?.path) return false;
      if (menu?.menu_type === "action") return false;
      if (uniquePaths.has(menu.path)) return false;

      uniquePaths.add(menu.path);
      return true;
    })
    .map((menu) => {
      const PageComponent = resolvePageComponent(menu);

      return (
        <Route
          key={menu.path}
          path={menu.path}
          element={
            <ProtectedRoute>
              <MainLayout>
                {PageComponent === PlaceholderPage ? (
                  <PlaceholderPage title={menu.name} />
                ) : (
                  <PageComponent menu={menu} />
                )}
              </MainLayout>
            </ProtectedRoute>
          }
        />
      );
    });
}