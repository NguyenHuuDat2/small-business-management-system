import { useState } from "react";
import CustomerForm from "./CustomerForm";
import { useCustomerOptions } from "@/hooks/useCustomerOptions";

export default function CustomerFormPage() {
  const { customers = [], refreshCustomers, loading } = useCustomerOptions();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleEdit = (customer) => {
    setEditing(customer);
    setOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <div className="p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Khách hàng</h1>

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Thêm khách hàng
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      )}

      {/* EMPTY STATE */}
      {!loading && customers.length === 0 && (
        <div className="text-gray-500 text-center py-10 bg-white rounded shadow">
          Chưa có khách hàng nào
        </div>
      )}

      {/* TABLE */}
      {!loading && customers.length > 0 && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Tên</th>
                <th className="p-3 text-left">SĐT</th>
                <th className="p-3 text-left">Địa chỉ</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.address}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM MODAL */}
      <CustomerForm
        open={open}
        initialData={editing}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refreshCustomers();
        }}
      />
    </div>
  );
}