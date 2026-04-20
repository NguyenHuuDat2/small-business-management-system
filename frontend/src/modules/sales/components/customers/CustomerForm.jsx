import { useState, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

const defaultForm = {
  name: "",
  phone: "",
  address: ""
};

export default function CustomerForm({
  open,
  onClose,
  onSuccess,
  initialData
}) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  // reset form khi mở / đổi mode
  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name || "",
              phone: initialData.phone || "",
              address: initialData.address || ""
            }
          : defaultForm
      );
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submit = async (e) => {
    e?.preventDefault();

    try {
      setLoading(true);

      if (isEdit) {
        await axiosClient.put(`/sales/customers/${initialData.id}`, form);
      } else {
        await axiosClient.post("/sales/customers", form);
      }

      onSuccess?.();
      onClose?.(); // auto close sau khi save
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi lưu khách hàng!");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[500px] p-6 rounded-xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">
          {isEdit ? "Cập nhật khách hàng" : "Thêm khách hàng"}
        </h2>

        <form onSubmit={submit} className="space-y-3">
          <input
            name="name"
            placeholder="Tên khách hàng"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full border p-2 rounded"
          />

          <input
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
            className="w-full border p-2 rounded"
          />

          <input
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            disabled={loading}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}