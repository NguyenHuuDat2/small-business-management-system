import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiInbox
} from "react-icons/fi";
import toast from "react-hot-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { salesReportService } from "../../services/salesReportService";

const STATUS_COLORS = {
  draft: "#94a3b8",
  submitted: "#6366f1",
  approved: "#10b981",
  rejected: "#ef4444",
  sent_to_warehouse: "#f59e0b",
  delivered: "#22c55e",
  cancelled: "#64748b",
};

const STATUS_LABELS = {
  draft: "Nháp",
  submitted: "Đã gửi",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  sent_to_warehouse: "Chờ xuất kho",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function StatCard({ title, value, icon, desc, colorClass = "bg-teal-50 text-teal-600" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
             <FiTrendingUp className="text-teal-500" /> {desc}
          </div>
        </div>
        <div className={`rounded-2xl p-3 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  );
}

function SalesReportPage() {
  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const fetchReport = async (nextRange = range) => {
    setLoading(true);
    try {
      const response = await salesReportService.getOverview({ range: nextRange });
      setReport(response?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(range);
  }, [range]);

  const summary = report?.summary || {};
  const statusCounts = summary?.status_counts || {};
  const topCustomers = report?.top_customers || [];
  const topProducts = report?.top_products || [];

  const pieData = Object.keys(STATUS_COLORS)
    .map(key => ({
      name: STATUS_LABELS[key],
      value: statusCounts[key] || 0,
      color: STATUS_COLORS[key]
    }))
    .filter(item => item.value > 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiBarChart2 size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Báo cáo bán hàng</h1>
              <p className="mt-1 text-sm text-slate-500">Dữ liệu kinh doanh được cập nhật theo thời gian thực.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
              {[
                { id: "1d", label: "Hôm nay" },
                { id: "7d", label: "7 ngày" },
                { id: "30d", label: "30 ngày" },
                { id: "all", label: "Tất cả" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`rounded-lg px-4 py-1.5 transition ${range === r.id ? "bg-white font-medium text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button 
              onClick={() => fetchReport(range)} 
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} /> {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 animate-pulse">
           {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl border border-slate-200"></div>)}
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Tổng đơn" value={summary.total_orders || 0} desc="Giao dịch trong kỳ" icon={<FiFileText size={20} />} />
            <StatCard title="Doanh thu" value={`${formatCurrency(summary.total_revenue)}đ`} desc="Tổng doanh thu gộp" icon={<FiDollarSign size={20} />} colorClass="bg-blue-50 text-blue-600" />
            <StatCard title="Đơn trung bình" value={`${formatCurrency(summary.average_order_value)}đ`} desc="Giá trị mỗi đơn hàng" icon={<FiShoppingBag size={20} />} colorClass="bg-purple-50 text-purple-600" />
            <StatCard title="Khách hàng mới" value={topCustomers.length} desc="Khách hàng tích cực" icon={<FiUsers size={20} />} colorClass="bg-orange-50 text-orange-600" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bar Chart: Top Products */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-6 text-base font-semibold text-slate-900">Top 5 sản phẩm bán chạy nhất</h2>
              {topProducts.length > 0 ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts} margin={{ bottom: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        fontSize={10} 
                        tick={{fill: '#64748b'}}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        formatter={(value) => [`${value} đơn vị`, "Số lượng bán"]}
                      />
                      <Bar dataKey="total_quantity" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex flex-col items-center justify-center text-slate-400 italic">
                  <FiInbox size={48} className="mb-2 opacity-20" /> Chưa có dữ liệu bán hàng
                </div>
              )}
            </div>

            {/* Pie Chart: Status Distribution */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-6 text-base font-semibold text-slate-900">Tỷ lệ trạng thái đơn hàng</h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px' }} />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table: Product Details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mt-6">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-900">Chi tiết sản phẩm bán chạy</h2>
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">Bán tốt nhất</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-center w-16">STT</th>
                    <th className="px-4 py-4 font-semibold">Sản phẩm</th>
                    <th className="px-4 py-4 font-semibold">Mã hàng</th>
                    <th className="px-4 py-4 font-semibold text-center">Đã bán</th>
                    <th className="px-6 py-4 font-semibold text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition group">
                      <td className="px-6 py-4 text-center font-medium text-slate-400 group-hover:text-slate-900">
                        {idx + 1 <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] text-white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-orange-400'}`}>
                            {idx + 1}
                          </span>
                        ) : idx + 1}
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-800">{p.name}</td>
                      <td className="px-4 py-4 text-slate-500 font-mono">{p.product_code}</td>
                      <td className="px-4 py-4 text-center font-semibold text-slate-700">{p.total_quantity}</td>
                      <td className="px-6 py-4 text-right font-bold text-teal-600">
                        {formatCurrency(p.total_amount)}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Grid: Customers & Status Table */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 mt-6">
             <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                   <h2 className="font-semibold text-slate-900">Xếp hạng khách hàng</h2>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-600 font-medium">
                         <tr>
                            <th className="px-4 py-3">Khách hàng</th>
                            <th className="px-4 py-3 text-center">Số đơn</th>
                            <th className="px-4 py-3 text-right">Tổng chi tiêu</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {topCustomers.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 transition">
                               <td className="px-4 py-3">
                                  <div className="font-semibold text-slate-900">{c.name}</div>
                                  <div className="text-xs text-slate-500">{c.phone}</div>
                               </td>
                               <td className="px-4 py-3 text-center text-slate-600 font-medium">{c.total_orders}</td>
                               <td className="px-4 py-3 text-right font-bold text-teal-600">{formatCurrency(c.total_amount)}đ</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                <h2 className="font-semibold text-slate-900 mb-4">Chi tiết đơn hàng</h2>
                <div className="space-y-3">
                   {Object.entries(STATUS_COLORS).map(([key, color]) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-transparent hover:border-slate-200 transition">
                         <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: color}}></div>
                            <span className="text-sm font-medium text-slate-600">{STATUS_LABELS[key]}</span>
                         </div>
                         <span className="font-bold text-slate-900">{statusCounts[key] || 0}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesReportPage;