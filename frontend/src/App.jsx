import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import UsersPage from "./pages/UsersPage";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/users" />}
      />

      <Route
        path="/users"
        element={
          <MainLayout>
            <UsersPage />
          </MainLayout>
        }
      />

    </Routes>
  );
}

export default App;