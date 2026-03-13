import { useState } from "react";
import Sidebar from "../src/components/layout/Sidebar";
import Header from "../src/components/layout/Header";

function DashboardLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false);

  return (

    <div className="flex h-screen bg-gray-100">

      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col">

        <Header toggleSidebar={() => setCollapsed(!collapsed)} />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>

  );
}

export default DashboardLayout;