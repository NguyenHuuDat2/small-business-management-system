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
        Trung binh
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
      Binh thuong
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
    customerName: invoice.customer?.name || "Khach le",
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
    status: "Pending",
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

      const response = await invoiceService.list({
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
      setError("Khong tai duoc danh sach cong no");
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
    const totalOutstanding = receivables
      .filter((item) => item.status !== "Paid")
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
      message: `Nhac thanh toan hoa don ${receivable.invoiceNo} - so tien ${formatCurrency(
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
    toast.success("Da tao nhac no (UI demo, chua goi API)");
    closeReminder();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Cong no phai thu
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Quan ly hoa don chua thu tien, uu tien thu hoi va lich nhac no.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                <FiClock size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tong phai thu
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
                  Qua han
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
                  Den han gan
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
                placeholder="Tim ma hoa don, khach hang..."
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
                <option value="Pending">Cho thanh toan</option>
                <option value="all">Tat ca trang thai</option>
                <option value="Cancelled">Da huy</option>
                <option value="Paid">Da thanh toan</option>
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
              <option value="all">Tuoi no: Tat ca</option>
              <option value="current">Chua den han</option>
              <option value="1_7">Qua han 1-7 ngay</option>
              <option value="8_30">Qua han 8-30 ngay</option>
              <option value="31_plus">Qua han tren 30 ngay</option>
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
              <option value="all">Uu tien: Tat ca</option>
              <option value="high">Cao</option>
              <option value="medium">Trung binh</option>
              <option value="normal">Binh thuong</option>
            </select>
          </div>

          <div className="flex gap-2 xl:col-span-2">
            <button
              type="submit"
              onClick={handleSearchSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              <FiSearch />
              Tim
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
                <th className="px-6 py-4">Ma Hoa Don</th>
                <th className="px-6 py-4">Khach Hang</th>
                <th className="px-6 py-4">Ngay Xuat</th>
                <th className="px-6 py-4">Den Han</th>
                <th className="px-6 py-4">Qua Han</th>
                <th className="px-6 py-4">Gia Tri</th>
                <th className="px-6 py-4">Uu Tien</th>
                <th className="px-6 py-4">Trang Thai</th>
                <th className="px-6 py-4 text-center">Nhac No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-slate-400">
                    Dang tai du lieu cong no...
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
                          ? `+${item.overdueDays} ngay`
                          : item.overdueDays === 0
                          ? "Den han"
                          : `${item.overdueDays} ngay`}
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
                            : toast.error("Ban khong co quyen thao tac")
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <FiBell />
                        Nhac
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-20 text-center text-slate-400">
                    Khong co cong no phu hop
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

      {isReminderOpen && selectedReceivable ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Tao lich nhac no
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Hoa don {selectedReceivable.invoiceNo} -{" "}
                  {selectedReceivable.customerName}
                </p>
              </div>
              <button
                type="button"
                onClick={closeReminder}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Dong
              </button>
            </div>

            <form onSubmit={handleReminderSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kenh nhac no
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
                  <option>Dien thoai</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Noi dung
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
                  Huy
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Luu lich nhac
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
