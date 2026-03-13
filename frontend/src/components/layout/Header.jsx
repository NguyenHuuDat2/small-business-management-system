function Header({ toggleSidebar }) {

  return (

    <div className="bg-white shadow p-4 flex items-center justify-between">

      <button
        onClick={toggleSidebar}
        className="text-gray-600 text-xl"
      >
        ☰
      </button>

      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="border rounded px-3 py-1 w-1/3"
      />

      <div className="flex items-center space-x-4">

        <span className="text-xl cursor-pointer">🔔</span>

        <div className="flex items-center space-x-2">

          <img
            src="https://i.pravatar.cc/30"
            className="rounded-full"
          />

          <span>Nhân viên</span>

        </div>

      </div>

    </div>
  );
}

export default Header;