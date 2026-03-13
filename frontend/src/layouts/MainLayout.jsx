import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function MainLayout({ children }) {

  const [collapsed, setCollapsed] = useState(false);

  return (

    <div className="flex h-screen">

      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col">

        <Header toggleSidebar={() => setCollapsed(!collapsed)} />

        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
          {children}
        </div>

      </div>

    </div>

  );

}

export default MainLayout;