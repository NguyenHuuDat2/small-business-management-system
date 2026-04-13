import { useState } from "react";
import Sidebar from "../../shared/components/layout/Sidebar";
import Header from "../../shared/components/layout/Header";

function MainLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <Sidebar collapsed={collapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header toggleSidebar={() => setCollapsed((prev) => !prev)} />

        <main className="flex-1 overflow-auto bg-slate-100">
          <div className="p-4 md:p-6">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;