import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiRefreshCw, FiSearch, FiUsers, FiX } from "react-icons/fi";
import { customerService } from "../../services/customerService";

function CustomerFormModal({ open, onClose, onSubmit, initialData, submitting }) {
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    customer_type: "",
    note: "",
  });

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      customer_type: initialData?.customer_type || "",
      note: initialData?.note || "",
    });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Cập nhật khách hàng" : "Thêm khách hàng"}
            </h3>
            <p className="text-sm text-slate-500">
              Điền thông tin khách hàng để sử dụng khi tạo đơn bán hàng
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tên khách hàng
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Nhập tên khách hàng"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Loại khách hàng
              </label>
              <input
                name="customer_type"
                value={form.customer_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Ví dụ: Đại lý, Khách lẻ..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Địa chỉ
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ghi chú
            </label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="Ghi chú thêm..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting
                ? "Đang xử lý..."
                : isEdit
                ? "Lưu cập nhật"
                : "Tạo khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomerListPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  const params = useMemo(
    () => ({
      q: debouncedKeyword,
      page,
      per_page: 10,
    }),
    [debouncedKeyword, page]
  );

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await customerService.getList(params);
      setData(response?.data || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách khách hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [params.q, params.page]);

  const openCreateModal = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleSubmitForm = async (form) => {
    setSubmitting(true);

    try {
      if (editingCustomer?.id) {
        await customerService.update(editingCustomer.id, form);
        toast.success("Cập nhật khách hàng thành công");
      } else {
        await customerService.create(form);
        toast.success("Tạo khách hàng thành công");
      }

      setModalOpen(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể lưu khách hàng"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiUsers size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Khách hàng</h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý dữ liệu khách hàng để dùng khi tạo đơn bán hàng.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchCustomers}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FiRefreshCw />
              Làm mới
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <FiPlus />
              Thêm khách hàng
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã, tên, số điện thoại, địa chỉ..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm text-slate-600">
            Tổng khách hàng:{" "}
            <span className="font-semibold text-slate-900">{data?.total || 0}</span>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Đang tải danh sách khách hàng...
          </div>
        ) : customers.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Không có khách hàng phù hợp.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã KH</th>
                  <th className="px-4 py-3 font-semibold">Tên khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                  <th className="px-4 py-3 font-semibold">Loại</th>
                  <th className="px-4 py-3 font-semibold">Địa chỉ</th>
                  <th className="px-4 py-3 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {customer.customer_code}
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {customer.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {customer.phone || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {customer.customer_type || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {customer.address || "-"}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(customer)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        <FiEdit2 />
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Trang {data?.current_page || 1} / {data?.last_page || 1}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={(data?.current_page || 1) <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>

            <button
              type="button"
              disabled={(data?.current_page || 1) >= (data?.last_page || 1)}
              onClick={() =>
                setPage((prev) => Math.min(data?.last_page || 1, prev + 1))
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <CustomerFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSubmitForm}
        initialData={editingCustomer}
        submitting={submitting}
      />
    </div>
  );
}

export default CustomerListPage;