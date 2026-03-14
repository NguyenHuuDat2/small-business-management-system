import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import UserModal from "../modals/UserModal";
import userService from "../../services/userService";
import toast from "react-hot-toast";

function UserTable({ users, reloadUsers }) {

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
    setPage(1);
  }, [users]);

  // DELETE USER
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Bạn chắc chắn muốn xoá nhân viên này?");

    if (!confirmDelete) return;

    try {

      await userService.remove(id);

      toast.success("Xoá nhân viên thành công");

      reloadUsers();

    } catch (err) {

      toast.error("Xoá nhân viên thất bại");
      console.log("Delete error:", err);

    }

  };



  // SEARCH
  const filteredUsers = (users || []).filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sort === "asc" ? a.id - b.id : b.id - a.id
  );

  // PAGINATION
  const start = (page - 1) * limit;
  const paginatedUsers = sortedUsers.slice(start, start + Number(limit));
  const totalPages = Math.ceil(sortedUsers.length / limit);

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Tìm nhân viên..."
          className="border px-4 py-2 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <div className="flex gap-3">

          {/* LIMIT */}
          <select
            className="border px-3 py-2 rounded-lg"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="5">5 dòng</option>
            <option value="10">10 dòng</option>
            <option value="20">20 dòng</option>
          </select>

          {/* CREATE BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus />
            Thêm nhân viên
          </button>

        </div>

      </div>

      {/* TABLE */}

      <table className="w-full border rounded-lg overflow-hidden">

        <thead className="bg-gray-100 text-gray-700">

          <tr>

            <th
              className="p-3 cursor-pointer"
              onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            >
              ID {sort === "asc" ? "▲" : "▼"}
            </th>

            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">SĐT</th>
            <th className="p-3 text-center">Hành động</th>

          </tr>

        </thead>

        <tbody>

          {paginatedUsers.map((user) => (

            <tr
              key={user.id}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="p-3">{user.id}</td>
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.phone}</td>

              <td className="p-3 flex justify-center gap-3">

                {/* EDIT */}

                <button
                  onClick={() => {
                    setEditingUser(user);
                    setOpenModal(true);
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                  Sửa
                </button>
                {/* DELETE */}

                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                  Xoá
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* PAGINATION */}

      <div className="flex justify-center items-center gap-4 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          ← Trước
        </button>

        <span className="font-medium text-gray-600">
          Trang {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          Sau →
        </button>

      </div>

      {/* MODAL */}

      <UserModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingUser(null);
        }}
        reloadUsers={reloadUsers}
        user={editingUser}
      />


    </div>

  );

}

export default UserTable;