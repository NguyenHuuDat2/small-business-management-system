import { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { salesReportService } from "../../services/salesReportService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function StatCard({ title, value, icon, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          <div className="mt-2 text-xs text-slate-400">{desc}</div>
        </div>

        <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">{icon}</div>
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
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải báo cáo bán hàng"
      );
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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiBarChart2 size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Báo cáo bán hàng</h1>
              <p className="mt-1 text-sm text-slate-500">
                Theo dõi hiệu quả bán hàng theo khoảng thời gian và nhóm dữ liệu quan trọng.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
              <button
                type="button"
                onClick={() => setRange("7d")}
                className={`rounded-lg px-3 py-1.5 ${
                  range === "7d"
                    ? "bg-white font-medium text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                7 ngày
              </button>
              <button
                type="button"
                onClick={() => setRange("30d")}
                className={`rounded-lg px-3 py-1.5 ${
                  range === "30d"
                    ? "bg-white font-medium text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                30 ngày
              </button>
              <button
                type="button"
                onClick={() => setRange("all")}
                className={`rounded-lg px-3 py-1.5 ${
                  range === "all"
                    ? "bg-white font-medium text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Tất cả
              </button>
            </div>

            <button
              type="button"
              onClick={() => fetchReport(range)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FiRefreshCw />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Đang tải báo cáo bán hàng...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng đơn"
              value={summary.total_orders || 0}
              desc="Tổng số đơn trong khoảng chọn"
              icon={<FiFileText size={20} />}
            />
            <StatCard
              title="Doanh thu"
              value={`${formatCurrency(summary.total_revenue || 0)}đ`}
              desc="Tổng doanh thu theo đơn"
              icon={<FiDollarSign size={20} />}
            />
            <StatCard
              title="Giá trị đơn TB"
              value={`${formatCurrency(summary.average_order_value || 0)}đ`}
              desc="Doanh thu / số lượng đơn"
              icon={<FiShoppingBag size={20} />}
            />
            <StatCard
              title="Khách hàng nổi bật"
              value={topCustomers.length}
              desc="Top khách hàng theo doanh thu"
              icon={<FiUsers size={20} />}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
              <h2 className="text-base font-semibold text-slate-900">
                Trạng thái đơn hàng
              </h2>

              <div className="mt-4 space-y-3">
                {[
                  ["Nháp", statusCounts.draft || 0],
                  ["Đã gửi", statusCounts.submitted || 0],
                  ["Đã duyệt", statusCounts.approved || 0],
                  ["Từ chối", statusCounts.rejected || 0],
                  ["Đã gửi kho", statusCounts.sent_to_warehouse || 0],
                  ["Đã giao", statusCounts.delivered || 0],
                  ["Đã hủy", statusCounts.cancelled || 0],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Top khách hàng
                </h2>
              </div>

              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Khách hàng</th>
                      <th className="px-4 py-3 font-semibold">SĐT</th>
                      <th className="px-4 py-3 font-semibold">Số đơn</th>
                      <th className="px-4 py-3 font-semibold">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                          Chưa có dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      topCustomers.map((customer) => (
                        <tr key={customer.id} className="border-t border-slate-100">
                          <td className="px-4 py-4 font-medium text-slate-800">
                            {customer.name || "-"}
                          </td>
                          <td className="px-4 py-4 text-slate-600">
                            {customer.phone || "-"}
                          </td>
                          <td className="px-4 py-4 text-slate-700">
                            {customer.total_orders}
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-800">
                            {formatCurrency(customer.total_amount)}đ
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">Top sản phẩm</h2>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Mã SP</th>
                    <th className="px-4 py-3 font-semibold">Tên sản phẩm</th>
                    <th className="px-4 py-3 font-semibold">Tổng SL bán</th>
                    <th className="px-4 py-3 font-semibold">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                        Chưa có dữ liệu.
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product) => (
                      <tr key={product.id} className="border-t border-slate-100">
                        <td className="px-4 py-4 font-medium text-slate-700">
                          {product.product_code}
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-800">
                          {product.name}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {product.total_quantity}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-800">
                          {formatCurrency(product.total_amount)}đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesReportPage;