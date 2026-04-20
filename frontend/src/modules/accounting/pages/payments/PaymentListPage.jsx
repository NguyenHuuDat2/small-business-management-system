import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiFilter,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import invoiceService from "../../services/invoiceService";
import { useAuth } from "../../../../context/AuthContext";
import {
  addDays,
  formatCurrency,
  formatDate,
  getInvoiceStatusMeta,
  pickPaymentMethod,
  toNumber,
} from "../../utils/accountingHelpers";

const defaultMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0,
};

const defaultForm = {
  invoice_no: "",
  payment_method: "Chuyen khoan",
  amount: "",
  note: "",
};

function mapInvoiceToPayment(invoice) {
  return {
    id: invoice.id,
    invoiceNo: invoice.invoice_no,
    paymentNo: `PT-${invoice.invoice_no || invoice.id}`,
    customerName: invoice.customer?.name || "Khach le",
    orderNo: invoice.sales_order?.order_no || "-",
    amount: toNumber(invoice.total_amount),
    invoiceStatus: invoice.status,
    paymentMethod: pickPaymentMethod(invoice.id),
    paidAt:
      invoice.status === "Paid" ? addDays(invoice.created_at, 1) : null,
    createdAt: invoice.created_at,
  };
}

function PaymentStatusBadge({ status }) {
  const meta = getInvoiceStatusMeta(status);
  const icon =
    meta.code === "Paid" ? (
      <FiCheckCircle />
    ) : meta.code === "Cancelled" ? (
      <FiXCircle />
    ) : (
      <FiClock />
    );

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
    >
      {icon}
      {meta.code === "Paid"
        ? "Da thu"
        : meta.code === "Cancelled"
        ? "Khong thu"
        : "Cho thu"}
    </span>
  );
}

function PaymentListPage() {
  const { hasPermission } = useAuth();

  const canCreate = hasPermission("accounting.payments.create");

  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState(defaultMeta);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const fetchPayments = async (currentFilters = filters, isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await invoiceService.list({
        search: currentFilters.search,
        status: currentFilters.status,
        page: currentFilters.page,
        per_page: 12,
      });
      const payload = response?.data || {};
      const rows = (payload.data || []).map(mapInvoiceToPayment);

      setPayments(rows);
      setMeta({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 12,
        total: payload.total || 0,
      });
    } catch {
      setPayments([]);
      setMeta(defaultMeta);
      setError("Khong tai duoc danh sach thanh toan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.status]);

  const stats = useMemo(() => {
    const collectedAmount = payments
      .filter((item) => item.invoiceStatus === "Paid")
      .reduce((sum, item) => sum + item.amount, 0);
    const pendingAmount = payments
      .filter((item) => item.invoiceStatus === "Pending")
      .reduce((sum, item) => sum + item.amount, 0);
    const failedCount = payments.filter(
      (item) => item.invoiceStatus === "Cancelled"
    ).length;

    return {
      collectedAmount,
      pendingAmount,
      failedCount,
    };
  }, [payments]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextFilters = {
      ...filters,
      search: searchInput.trim(),
      page: 1,
    };
    setFilters(nextFilters);
    fetchPayments(nextFilters);
  };

  const handleRefresh = () => fetchPayments(filters, true);

  const openCreateModal = () => {
    const firstInvoiceNo = payments[0]?.invoiceNo || "";
    const firstAmount = payments[0]?.amount || "";
    setForm({
      ...defaultForm,
      invoice_no: firstInvoiceNo,
      amount: firstAmount,
    });
    setIsModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsModalOpen(false);
    setForm(defaultForm);
  };

  const handleSubmitCreate = (event) => {
    event.preventDefault();
    toast.success("Da luu phieu thu (UI demo, chua goi API)");
    closeCreateModal();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Thanh toan
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Theo doi phieu thu, phuong thuc thanh toan va trang thai thu tien.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <FiDollarSign size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Da thu tren trang
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {formatCurrency(stats.collectedAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                <FiClock size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Cho thu tren trang
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {formatCurrency(stats.pendingAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
                <FiXCircle size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Khong thu duoc
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {stats.failedCount} phieu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-12">
          <form onSubmit={handleSearchSubmit} className="lg:col-span-7">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tim ma phieu thu, ma hoa don, khach hang..."
                className="w-full border-none bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </form>

          <div className="lg:col-span-3">
            <div className="flex items-center rounded-xl border border-slate-200 px-3">
              <FiFilter className="mr-2 text-slate-400" />
              <select
                value={filters.status}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: event.target.value,
                    page: 1,
                  }))
                }
                className="w-full bg-transparent py-2.5 text-sm outline-none"
              >
                <option value="">Tat ca trang thai</option>
                <option value="Paid">Da thu</option>
                <option value="Pending">Cho thu</option>
                <option value="Cancelled">Khong thu</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 lg:col-span-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>
            {canCreate && (
              <button
                type="button"
                onClick={openCreateModal}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
              >
                <FiPlus />
                Ghi nhan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Ma Phieu Thu</th>
                <th className="px-6 py-4">Hoa Don</th>
                <th className="px-6 py-4">Khach Hang</th>
                <th className="px-6 py-4">Phuong Thuc</th>
                <th className="px-6 py-4">So Tien</th>
                <th className="px-6 py-4">Ngay Thu</th>
                <th className="px-6 py-4">Trang Thai</th>
                <th className="px-6 py-4">Don Hang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-slate-400">
                    Dang tai du lieu thanh toan...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-6 py-4 font-semibold text-teal-600">
                      {payment.paymentNo}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {payment.invoiceNo}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {payment.customerName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        <FiCreditCard />
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {payment.paidAt
                        ? formatDate(payment.paidAt)
                        : `Du kien ${formatDate(addDays(payment.createdAt, 3))}`}
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={payment.invoiceStatus} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {payment.orderNo}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-slate-400">
                    Khong co phieu thu phu hop
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-6 py-4">
          <p className="text-xs font-semibold text-slate-500">
            Trang {meta.current_page} / {meta.last_page} - Tong {meta.total} ban
            ghi
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={meta.current_page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <FiChevronLeft />
              Truoc
            </button>
            <button
              type="button"
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={meta.current_page >= meta.last_page}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Sau
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Ghi nhan thanh toan
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Form giao dien de bo sung API tao phieu thu sau nay.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Dong
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Ma hoa don
                </label>
                <input
                  value={form.invoice_no}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, invoice_no: event.target.value }))
                  }
                  placeholder="INV-20260420-001"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phuong thuc
                  </label>
                  <select
                    value={form.payment_method}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        payment_method: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option>Chuyen khoan</option>
                    <option>Tien mat</option>
                    <option>Vi dien tu</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    So tien
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, amount: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Ghi chu
                </label>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, note: event.target.value }))
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Luu phieu thu
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PaymentListPage;
