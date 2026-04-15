import { Outlet } from "react-router-dom";
import { HrDataProvider } from "../context/HrDataContext";

function HrLayout() {
  return (
    <HrDataProvider>
      <Outlet />
    </HrDataProvider>
  );
}

export default HrLayout;