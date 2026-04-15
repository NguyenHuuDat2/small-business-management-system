import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiFilter
} from "react-icons/fi";
import invoiceService from "../../services/invoiceService";
import { useAuth } from "../../../../context/AuthContext";

/**
 * Helper: Định dạng tiền tệ từ String/Number sang VND
 */
const formatCurrency = (value) => {
  const number = Number(value || 0); // Ép kiểu vì API trả về chuỗi "1500000.00"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

/**
 * Component hiển thị Badge trạng thái dựa trên field 'status' của API
 */
const StatusBadge = ({ status }) => {
  const statusMap = {
    Paid: { label: "Đã thanh toán", class: "bg-emerald-100 text-emerald-700", icon: <FiCheckCircle /> },
    Pending: { label: "Chờ thanh toán", class: "bg-amber-100 text-amber-700", icon: <FiClock /> },
    Cancelled: { label: "Đã hủy", class: "bg-rose-100 text-rose-700", icon: <FiXCircle /> },
  };
  const current = statusMap[status] || statusMap.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${current.class}`}>
      {current.icon}
      {current.label}
    </span>
  );
};

function InvoiceListPage() {
  const { hasPermission } = useAuth();

  // Kiểm tra quyền (Sơn có thể điều chỉnh slug phù hợp với DB)
  const canCreate = hasPermission("accounting.invoices.create");
  const canUpdate = hasPermission("accounting.invoices.update");

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
  });

  // Tính toán thống kê nhanh từ dữ liệu hiện tại trên trang
  const stats = useMemo(() => {
    return {
      totalAmountOnPage: invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0),
    };
  }, [invoices]);

  /**
   * Hàm gọi API load dữ liệu
   */
  const fetchInvoices = async (currentFilters = filters, isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await invoiceService.list(currentFilters);
      
      // Bóc tách dữ liệu từ cấu trúc Paginator của Laravel
      const { data, current_page, last_page, per_page, total } = response.data;

      setInvoices(data || []);
      setMeta({ 
        current_page: current_page || 1, 
        last_page: last_page || 1, 
        per_page: per_page || 15, 
        total: total || 0 
      });
    } catch (err) {
      toast.error("Không thể tải danh sách hóa đơn từ máy chủ");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Tự động fetch khi thay đổi trang hoặc filter trạng thái
  useEffect(() => {
    fetchInvoices(filters);
  }, [filters.page, filters.status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput.trim(), page: 1 }));
  };

  const handleRefresh = () => fetchInvoices(filters, true);

  return (
    <div className="space-y-4">
      {/* --- Section 1: Tiêu đề & Thống kê --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hóa đơn bán hàng</h1>
            <p className="text-sm text-slate-500 font-medium">Quản lý hóa đơn kế toán và theo dõi dòng tiền.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-sky-100 p-2 text-sky-600"><FiFileText size={18}/></div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tổng số</p>
                <p className="text-sm font-bold text-slate-700">{meta.total} HĐ</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 font-bold">₫</div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Tổng tiền trang</p>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(stats.totalAmountOnPage)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 2: Bộ lọc & Thao tác --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-12">
          <form onSubmit={handleSearchSubmit} className="lg:col-span-6">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
              <FiSearch className="text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm mã hóa đơn, tên khách hàng..."
                className="w-full border-none bg-transparent px-3 py-2.5 text-sm outline-none"
              />
            </div>
          </form>

          <div className="lg:col-span-3">
            <div className="flex items-center rounded-xl border border-slate-200 px-3">
              <FiFilter className="text-slate-400 mr-2" />
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="w-full bg-transparent py-2.5 text-sm outline-none cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Paid">Đã thanh toán</option>
                <option value="Pending">Chờ thanh toán</option>
                <option value="Cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 lg:col-span-3">
            <button onClick={handleRefresh} className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>
            {canCreate && (
              <button className="flex-[3] flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 shadow-md shadow-teal-100 transition-all active:scale-95">
                <FiPlus /> Lập hóa đơn
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Section 3: Bảng dữ liệu --- */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã Hóa Đơn</th>
                <th className="px-6 py-4">Khách Hàng</th>
                <th className="px-6 py-4">Đơn Hàng</th>
                <th className="px-6 py-4">Tổng Tiền</th>
                <th className="px-6 py-4">Ngày Xuất</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-slate-400 font-medium">Đang tải dữ liệu hóa đơn...</td></tr>
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-teal-600">{inv.invoice_no}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{inv.customer?.name || "Khách lẻ"}</td>
                    <td className="px-6 py-4 text-slate-500">{inv.sales_order?.order_no || "-"}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(inv.total_amount)}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(inv.created_at).toLocaleDateString('vi-VN')}</td>
                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                          <FiEye size={18} />
                        </button>
                        {canUpdate && inv.status !== 'Paid' && (
                          <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-teal-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                            <FiEdit2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="py-20 text-center text-slate-400 font-medium">Không tìm thấy dữ liệu phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Section 4: Phân trang --- */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/30">
          <p className="text-xs font-semibold text-slate-500">
            Trang {meta.current_page} / {meta.last_page} — Tổng {meta.total} bản ghi
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
              disabled={meta.current_page <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
            >
              <FiChevronLeft /> Trước
            </button>
            <button
              onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
              disabled={meta.current_page >= meta.last_page}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
            >
              Sau <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceListPage;