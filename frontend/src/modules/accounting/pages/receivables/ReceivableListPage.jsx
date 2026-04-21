import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiAlertTriangle,
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import invoiceService from "../../services/invoiceService";
import { useAuth } from "../../../../context/AuthContext";
import {
  calcOverdueDays,
  estimateDueDate,
  formatCurrency,
  formatDate,
  getAgingBucket,
  getInvoiceStatusMeta,
  getReceivablePriority,
  toNumber,
} from "../../utils/accountingHelpers";

const defaultMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0,
};

function PriorityBadge({ priority }) {
  if (priority === "high") {
    return (
      <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
        Cao
      </span>
    );
  }

  if (priority === "medium") {
    return (
        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
        Trung bình
      </span>
    );
  }

  return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
      Bình thường
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = getInvoiceStatusMeta(status);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

function mapInvoiceToReceivable(invoice) {
  const dueDate = estimateDueDate(invoice.created_at, 7);
  const overdueDays = calcOverdueDays(dueDate);
  const amount = toNumber(invoice.total_amount);

  return {
    id: invoice.id,
    invoiceNo: invoice.invoice_no,
    customerName: invoice.customer?.name || "Khách lẻ",
    issueDate: invoice.created_at,
    dueDate,
    overdueDays,
    amount,
    status: invoice.status,
    priority: getReceivablePriority(overdueDays, amount),
    agingBucket: getAgingBucket(overdueDays),
  };
}

function ReceivableListPage() {
  const { hasPermission } = useAuth();

  const canRemind = hasPermission("accounting.receivables.update");

  const [receivables, setReceivables] = useState([]);
  const [meta, setMeta] = useState(defaultMeta);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    aging: "all",
    priority: "all",
    page: 1,
  });

  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState(null);
  const [reminderForm, setReminderForm] = useState({
    channel: "Email",
    message: "",
  });

  const fetchReceivables = async (
    currentFilters = filters,
    isRefresh = false
  ) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await invoiceService.listReceivables({
        search: currentFilters.search,
        status: currentFilters.status === "all" ? "" : currentFilters.status,
        page: currentFilters.page,
        per_page: 12,
      });
      const payload = response?.data || {};
      const mappedRows = (payload.data || []).map(mapInvoiceToReceivable);

      const filteredRows = mappedRows.filter((row) => {
        const matchAging =
          currentFilters.aging === "all" ||
          row.agingBucket === currentFilters.aging;
        const matchPriority =
          currentFilters.priority === "all" ||
          row.priority === currentFilters.priority;
        return matchAging && matchPriority;
      });

      setReceivables(filteredRows);
      setMeta({
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 12,
        total: payload.total || 0,
      });
    } catch {
      setReceivables([]);
      setMeta(defaultMeta);
      setError("Không tải được danh sách công nợ");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReceivables(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.status, filters.aging, filters.priority]);

  const stats = useMemo(() => {
    const isPaid = (status) => String(status || "").toLowerCase() === "paid";
    const totalOutstanding = receivables
      .filter((item) => !isPaid(item.status))
      .reduce((sum, item) => sum + item.amount, 0);
    const overdueCount = receivables.filter((item) => item.overdueDays > 0).length;
    const dueSoonCount = receivables.filter(
      (item) => item.overdueDays <= 0 && item.overdueDays >= -3
    ).length;
    const highPriorityCount = receivables.filter(
      (item) => item.priority === "high"
    ).length;

    return {
      totalOutstanding,
      overdueCount,
      dueSoonCount,
      highPriorityCount,
    };
  }, [receivables]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const nextFilters = {
      ...filters,
      search: searchInput.trim(),
      page: 1,
    };
    setFilters(nextFilters);
    fetchReceivables(nextFilters);
  };

  const handleRefresh = () => fetchReceivables(filters, true);

  const openReminder = (receivable) => {
    setSelectedReceivable(receivable);
    setReminderForm({
      channel: "Email",
      message: `Nhắc thanh toán hóa đơn ${receivable.invoiceNo} - số tiền ${formatCurrency(
        receivable.amount
      )}.`,
    });
    setIsReminderOpen(true);
  };

  const closeReminder = () => {
    setSelectedReceivable(null);
    setIsReminderOpen(false);
  };

  const handleReminderSubmit = (event) => {
    event.preventDefault();
    toast.success("Đã tạo lịch nhắc nợ (UI demo, chưa gọi API)");
    closeReminder();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Công nợ phải thu
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Quản lý hóa đơn chưa thu tiền, ưu tiên thu hồi và lịch nhắc nợ.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                <FiClock size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tổng phải thu
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {formatCurrency(stats.totalOutstanding)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
                <FiAlertTriangle size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quá hạn
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {stats.overdueCount} hoa don
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-sky-100 p-2 text-sky-600">
                <FiBell size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Đến hạn gần
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {stats.dueSoonCount} hoa don
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-12">
          <form onSubmit={handleSearchSubmit} className="xl:col-span-4">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm mã hóa đơn, khách hàng..."
                className="w-full border-none bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </form>

          <div className="xl:col-span-2">
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
                <option value="Pending">Chờ thanh toán</option>
                <option value="all">Tất cả trạng thái</option>
                <option value="Cancelled">Đã hủy</option>
                <option value="Paid">Đã thanh toán</option>
              </select>
            </div>
          </div>

          <div className="xl:col-span-2">
            <select
              value={filters.aging}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  aging: event.target.value,
                  page: 1,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
            >
              <option value="all">Tuổi nợ: Tất cả</option>
              <option value="current">Chưa đến hạn</option>
              <option value="1_7">Quá hạn 1-7 ngày</option>
              <option value="8_30">Quá hạn 8-30 ngày</option>
              <option value="31_plus">Quá hạn trên 30 ngày</option>
            </select>
          </div>

          <div className="xl:col-span-2">
            <select
              value={filters.priority}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  priority: event.target.value,
                  page: 1,
                }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
            >
              <option value="all">Ưu tiên: Tất cả</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="normal">Bình thường</option>
            </select>
          </div>

          <div className="flex gap-2 xl:col-span-2">
            <button
              type="submit"
              onClick={handleSearchSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              <FiSearch />
              Tìm
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 hover:bg-slate-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Mã hóa đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày xuất</th>
                <th className="px-6 py-4">Đến hạn</th>
                <th className="px-6 py-4">Quá hạn</th>
                <th className="px-6 py-4">Giá trị</th>
                <th className="px-6 py-4">Ưu tiên</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-center">Nhắc nợ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-slate-400">
                    Đang tải dữ liệu công nợ...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : receivables.length > 0 ? (
                receivables.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-teal-600">
                      {item.invoiceNo}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.customerName}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(item.issueDate)}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(item.dueDate)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          item.overdueDays > 0
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.overdueDays > 0
                          ? `+${item.overdueDays} ngày`
                          : item.overdueDays === 0
                          ? "Đến hạn"
                          : `${item.overdueDays} ngày`}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          canRemind
                            ? openReminder(item)
                            : toast.error("Bạn không có quyền thao tác")
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <FiBell />
                        Nhắc
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-slate-400">
                    Không có công nợ phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-6 py-4">
          <p className="text-xs font-semibold text-slate-500">
            Trang {meta.current_page} / {meta.last_page} - Tổng {meta.total} bản
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
              Trước
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

      {isReminderOpen && selectedReceivable ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Tạo lịch nhắc nợ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Hóa đơn {selectedReceivable.invoiceNo} -{" "}
                  {selectedReceivable.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReminder}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleReminderSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kênh nhắc nợ
                </label>
                <select
                  value={reminderForm.channel}
                  onChange={(event) =>
                    setReminderForm((prev) => ({
                      ...prev,
                      channel: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Điện thoại</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nội dung
                </label>
                <textarea
                  rows={4}
                  value={reminderForm.message}
                  onChange={(event) =>
                    setReminderForm((prev) => ({
                      ...prev,
                      message: event.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeReminder}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Lưu lịch nhắc
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ReceivableListPage;
