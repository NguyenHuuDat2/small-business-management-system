import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import { paymentService } from "../../services/paymentService";
import { accountingReferenceService } from "../../services/accountingReferenceService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function PaymentFormModal({ open, onClose, onSubmit, initialData, submitting, invoices }) {
  const isEdit = !!initialData?.id;

  const getInitialForm = () => ({
    invoice_id: initialData?.invoice_id ? String(initialData.invoice_id) : "",
    amount:
      initialData?.amount !== null && initialData?.amount !== undefined
        ? String(initialData.amount)
        : "",
    payment_method: initialData?.payment_method || "",
    status: initialData?.status || "paid",
  });

  const [form, setForm] = useState(getInitialForm);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "invoice_id") {
      const selected = invoices.find((item) => String(item.id) === value);
      if (selected && !isEdit) {
        setForm((prev) => ({
          ...prev,
          invoice_id: value,
          amount: String(selected.balance_amount || selected.total_amount || ""),
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
              {isEdit ? "Cập nhật thanh toán" : "Ghi nhận thanh toán"}
            </h3>
            <p className="text-sm text-slate-500">Nhập thông tin giao dịch thanh toán cho hóa đơn.</p>
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
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Hóa đơn</label>
              <select
                name="invoice_id"
                value={form.invoice_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Chọn hóa đơn</option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoice_no} - {invoice.customer_name || "-"} - Còn lại{" "}
                    {formatCurrency(invoice.balance_amount)}đ
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Số tiền</label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Nhập số tiền"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Phương thức</label>
              <input
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Ví dụ: Chuyển khoản, tiền mặt"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="paid">Thành công</option>
                <option value="failed">Thất bại</option>
                <option value="refunded">Hoàn tiền</option>
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
              {submitting
                ? "Đang xử lý..."
                : isEdit
                ? "Lưu cập nhật"
                : "Ghi nhận thanh toán"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentListPage() {
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

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
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

  const loadInvoiceOptions = async () => {
    try {
      const response = await accountingReferenceService.getInvoices({ limit: 200 });
      setInvoices(response?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Không thể tải danh sách hóa đơn"
      );
    }
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await paymentService.getList(params);
      setData(response?.data || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách thanh toán"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    loadInvoiceOptions();
  }, []);

  const openCreateModal = () => {
    setEditingPayment(null);
    setModalSeed((prev) => prev + 1);
    setModalOpen(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setModalSeed((prev) => prev + 1);
    setModalOpen(true);
  };

  const handleSubmitForm = async (form) => {
    setSubmitting(true);

    const payload = {
      invoice_id: Number(form.invoice_id),
      amount: Number(form.amount || 0),
      payment_method: form.payment_method?.trim() || null,
      status: form.status,
    };

    try {
      if (editingPayment?.id) {
        await paymentService.update(editingPayment.id, payload);
        toast.success("Cập nhật thanh toán thành công");
      } else {
        await paymentService.create(payload);
        toast.success("Ghi nhận thanh toán thành công");
      }

      setModalOpen(false);
      setEditingPayment(null);
      fetchPayments();
      loadInvoiceOptions();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Không thể lưu thanh toán"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayment = async (payment) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thanh toán "${payment.payment_no}" không?`
    );

    if (!confirmed) return;

    try {
      await paymentService.remove(payment.id);
      toast.success("Xóa thanh toán thành công");

      const nextPage =
        (data?.data || []).length === 1 && (data?.current_page || 1) > 1
          ? (data?.current_page || 1) - 1
          : data?.current_page || 1;

      setPage(nextPage);
      fetchPayments();
      loadInvoiceOptions();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Xóa thanh toán thất bại");
    }
  };

  const payments = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiCreditCard size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Thanh toán</h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý giao dịch thu tiền từ khách hàng theo từng hóa đơn.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchPayments}
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
              Ghi nhận thanh toán
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
              placeholder="Tìm theo mã thanh toán, mã hóa đơn, khách hàng..."
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
            <option value="pending">Chờ xử lý</option>
            <option value="paid">Thành công</option>
            <option value="failed">Thất bại</option>
            <option value="refunded">Hoàn tiền</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm text-slate-600">
            Tổng giao dịch: <span className="font-semibold text-slate-900">{data?.total || 0}</span>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Đang tải danh sách thanh toán...
          </div>
        ) : payments.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">Không có giao dịch phù hợp.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã thanh toán</th>
                  <th className="px-4 py-3 font-semibold">Mã hóa đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold text-right">Số tiền</th>
                  <th className="px-4 py-3 font-semibold">Phương thức</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-700">{payment.payment_no}</td>
                    <td className="px-4 py-4 text-slate-600">{payment.invoice_no || "-"}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.customer_name || "-"}</td>
                    <td className="px-4 py-4 text-right text-emerald-700">
                      {formatCurrency(payment.amount)}đ
                    </td>
                    <td className="px-4 py-4 text-slate-600">{payment.payment_method || "-"}</td>
                    <td className="px-4 py-4 text-slate-600">{payment.status}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(payment)}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <FiEdit2 />
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePayment(payment)}
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

      <PaymentFormModal
        key={`${editingPayment?.id || "new"}-${modalSeed}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingPayment}
        submitting={submitting}
        invoices={invoices}
      />
    </div>
  );
}

export default PaymentListPage;
