import {
  FiHome,
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiDollarSign,
} from "react-icons/fi";

function Sidebar({ collapsed }) {
  const menus = [
    { name: "Dashboard", icon: <FiHome /> },
    { name: "Nhân viên", icon: <FiUsers /> },
    { name: "Bán hàng", icon: <FiShoppingCart /> },
    { name: "Kho", icon: <FiBox /> },
    { name: "Kế toán", icon: <FiDollarSign /> },
  ];

  return (
    <div
      className={`h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 text-xl font-bold border-b border-blue-600">
        {collapsed ? "EP" : "Hệ thống nhân viên"}
      </div>

      <ul className="mt-4">

        {menus.map((menu, index) => (
          <li
            key={index}
            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-600 cursor-pointer transition rounded-lg mx-2"
          >
            <span className="text-lg">{menu.icon}</span>

            {!collapsed && <span>{menu.name}</span>}
          </li>
        ))}

      </ul>
    </div>
  );
}

export default Sidebar;