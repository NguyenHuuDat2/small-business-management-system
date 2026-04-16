import { useState } from "react";
import useProduct from "../../hooks/useProduct";
import PlaceholderPage from "../../../../shared/components/ui/PlaceholderPage";

function GoodsReceiptPage() {
  return <PlaceholderPage title="Sản phẩm " />;
}


export default function ProductPage() {
  const { products, categories, units, addProduct, editProduct, removeProduct } = useProduct();

  const [form, setForm] = useState({
    id: null,
    name: "",
    price: "",
    category_id: "",
    unit_id: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.id) {
      editProduct(form.id, form);
    } else {
      addProduct(form);
    }

    setForm({ id: null, name: "", price: "", category_id: "", unit_id: "" });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package size={24} />
        <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <form className="grid grid-cols-5 gap-3" onSubmit={handleSubmit}>
          <input
            className="border p-2 rounded"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Danh mục</option>
            {(categories || []).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={form.unit_id}
            onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
          >
            <option value="">Đơn vị</option>
            {(units || []).map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-1 bg-green-500 text-white rounded px-3">
            <Plus size={16} />
            {form.id ? "Cập nhật" : "Thêm"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Đơn vị</th>
              <th>Giá</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {(products || []).map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td>{p.name}</td>
                <td>{p.category?.name}</td>
                <td>{p.unit?.name}</td>
                <td>{p.price}</td>
                <td className="space-x-2">
                  <button onClick={() => setForm(p)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => removeProduct(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}