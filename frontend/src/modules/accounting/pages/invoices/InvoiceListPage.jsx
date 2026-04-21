import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { invoiceService } from "../../services/invoiceService";
import { accountingReferenceService } from "../../services/accountingReferenceService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function InvoiceFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  submitting,
  customers,
  salesOrders,
}) {
  const isEdit = !!initialData?.id;

  const getInitialForm = () => ({
    customer_id: initialData?.customer_id ? String(initialData.customer_id) : "",
    sales_order_id: initialData?.sales_order_id ? String(initialData.sales_order_id) : "",
    total_amount:
      initialData?.total_amount !== null && initialData?.total_amount !== undefined
        ? String(initialData.total_amount)
        : "",
    status: initialData?.status || "issued",
  });

  const [form, setForm] = useState(getInitialForm);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "sales_order_id") {
      const selected = salesOrders.find((item) => String(item.id) === value);

      if (selected) {
        setForm((prev) => ({
          ...prev,
          sales_order_id: value,
          customer_id: String(selected.customer_id || ""),
          total_amount: String(selected.total_amount || ""),
        }));
      }
    }
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
              {isEdit ? "Cập nhật hóa đơn" : "Tạo hóa đơn"}
            </h3>
            <p className="text-sm text-slate-500">
              Chọn đơn bán hàng và kiểm tra thông tin trước khi phát hành hóa đơn.
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
                Khách hàng
              </label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Chọn khách hàng</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customer_code} - {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Đơn bán hàng
              </label>
              <select
                name="sales_order_id"
                value={form.sales_order_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Chọn đơn bán hàng</option>
                {salesOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_no} - {formatCurrency(order.total_amount)}đ
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tổng tiền hóa đơn
              </label>
              <input
                name="total_amount"
                type="number"
                min="0"
                step="0.01"
                value={form.total_amount}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Nhập tổng tiền"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Trạng thái
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="draft">Nháp</option>
                <option value="issued">Đã phát hành</option>
                <option value="partial">Thu một phần</option>
                <option value="paid">Đã thu đủ</option>
                <option value="overdue">Quá hạn</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
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
              {submitting ? "Đang xử lý..." : isEdit ? "Lưu cập nhật" : "Tạo hóa đơn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvoiceListPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [customers, setCustomers] = useState([]);
  const [salesOrders, setSalesOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [modalSeed, setModalSeed] = useState(0);

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
      status: statusFilter,
      page,
      per_page: 10,
    }),
    [debouncedKeyword, statusFilter, page]
  );

  const loadReferences = async () => {
    try {
      const [customerResponse, salesOrderResponse] = await Promise.all([
        accountingReferenceService.getCustomers({ limit: 100 }),
        accountingReferenceService.getSalesOrders({ limit: 100 }),
      ]);

      setCustomers(customerResponse?.data || []);
      setSalesOrders(salesOrderResponse?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dữ liệu tham chiếu hóa đơn"
      );
    }
  };

  const fetchInvoices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await invoiceService.getList(params);
      setData(response?.data || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Không thể tải danh sách hóa đơn"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    loadReferences();
  }, []);

  const openCreateModal = () => {
    setEditingInvoice(null);
    setModalSeed((prev) => prev + 1);
    setModalOpen(true);
  };

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setModalSeed((prev) => prev + 1);
    setModalOpen(true);
  };

  const handleSubmitForm = async (form) => {
    setSubmitting(true);

    const payload = {
      customer_id: Number(form.customer_id),
      sales_order_id: Number(form.sales_order_id),
      total_amount: Number(form.total_amount || 0),
      status: form.status,
    };

    try {
      if (editingInvoice?.id) {
        await invoiceService.update(editingInvoice.id, payload);
        toast.success("Cập nhật hóa đơn thành công");
      } else {
        await invoiceService.create(payload);
        toast.success("Tạo hóa đơn thành công");
      }

      setModalOpen(false);
      setEditingInvoice(null);
      fetchInvoices();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Không thể lưu hóa đơn");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hóa đơn "${invoice.invoice_no}" không?`
    );
    if (!confirmed) return;

    try {
      await invoiceService.remove(invoice.id);
      toast.success("Xóa hóa đơn thành công");

      const nextPage =
        (data?.data || []).length === 1 && (data?.current_page || 1) > 1
          ? (data?.current_page || 1) - 1
          : data?.current_page || 1;

      setPage(nextPage);
      fetchInvoices();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Xóa hóa đơn thất bại");
    }
  };

  const invoices = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiFileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Hóa đơn</h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý phát hành hóa đơn và theo dõi tình trạng thu tiền.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchInvoices}
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
              Tạo hóa đơn
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo mã hóa đơn, mã đơn hàng, tên khách hàng..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="issued">Đã phát hành</option>
            <option value="partial">Thu một phần</option>
            <option value="paid">Đã thu đủ</option>
            <option value="overdue">Quá hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm text-slate-600">
            Tổng hóa đơn: <span className="font-semibold text-slate-900">{data?.total || 0}</span>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">Đang tải danh sách hóa đơn...</div>
        ) : invoices.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">Không có hóa đơn phù hợp.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã hóa đơn</th>
                  <th className="px-4 py-3 font-semibold">Đơn hàng</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold text-right">Tổng tiền</th>
                  <th className="px-4 py-3 font-semibold text-right">Đã thu</th>
                  <th className="px-4 py-3 font-semibold text-right">Còn lại</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-700">{invoice.invoice_no}</td>
                    <td className="px-4 py-4 text-slate-600">{invoice.order_no || "-"}</td>
                    <td className="px-4 py-4 text-slate-700">{invoice.customer_name || "-"}</td>
                    <td className="px-4 py-4 text-right text-slate-700">
                      {formatCurrency(invoice.total_amount)}đ
                    </td>
                    <td className="px-4 py-4 text-right text-emerald-700">
                      {formatCurrency(invoice.paid_amount)}đ
                    </td>
                    <td className="px-4 py-4 text-right text-rose-700">
                      {formatCurrency(invoice.balance_amount)}đ
                    </td>
                    <td className="px-4 py-4 text-slate-600">{invoice.status}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(invoice)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEdit2 />
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInvoice(invoice)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                        >
                          <FiTrash2 />
                          Xóa
                        </button>
                      </div>
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
              onClick={() => setPage((prev) => Math.min(data?.last_page || 1, prev + 1))}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <InvoiceFormModal
        key={`${editingInvoice?.id || "new"}-${modalSeed}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingInvoice}
        submitting={submitting}
        customers={customers}
        salesOrders={salesOrders}
      />
    </div>
  );
}

export default InvoiceListPage;
