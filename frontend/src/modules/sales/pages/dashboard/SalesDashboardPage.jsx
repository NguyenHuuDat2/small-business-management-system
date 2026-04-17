import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../../../context/AuthContext";
import { salesDashboardService } from "../../services/salesDashboardService";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function StatCard({ title, value, subtext, icon, tone = "teal" }) {
  const tones = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          {subtext ? (
            <div className="mt-2 text-xs text-slate-400">{subtext}</div>
          ) : null}
        </div>

        <div className={`rounded-2xl p-3 ${tones[tone] || tones.teal}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:bg-slate-50"
    >
      <div>
        <div className="font-semibold text-slate-800">{title}</div>
        <div className="mt-1 text-sm text-slate-500">{desc}</div>
      </div>
      <FiArrowRight className="text-slate-400" />
    </button>
  );
}

function FocusItem({ icon, title, value, desc, tone = "slate" }) {
  const tones = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2.5 ${tones[tone] || tones.slate}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
          <div className="mt-1 text-sm text-slate-500">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function PipelineCard({ title, count, colorClass, percent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-600">{title}</div>
        <div className="text-lg font-bold text-slate-900">{count}</div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-slate-400">{percent}% trên tổng đơn</div>
    </div>
  );
}

function SectionTitle({ title, desc }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
    </div>
  );
}

function SalesDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [timeView, setTimeView] = useState("today");

  const roleName =
    user?.role?.name || user?.role?.role_code || "Nhân viên bán hàng";
  const displayName =
    user?.employee?.name || user?.name || "Nhân viên bán hàng";

  const fetchStats = async () => {
    setLoading(true);

    try {
      const response = await salesDashboardService.getStats();
      setStats(response?.data || null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dashboard bán hàng"
      );
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const summary = stats?.summary || {};
  const recentOrders = stats?.recent_orders || [];

  const totalOrders = Number(summary.total_orders || 0);
  const draftOrders = Number(summary.draft_orders || 0);
  const submittedOrders = Number(summary.submitted_orders || 0);
  const approvedOrders = Number(summary.approved_orders || 0);
  const cancelledOrders = Number(summary.cancelled_orders || 0);

  const toPercent = (value) => {
    if (!totalOrders) return 0;
    return Math.round((Number(value || 0) / totalOrders) * 100);
  };

  const focusData = useMemo(() => {
    const common = {
      today: [
        {
          icon: <FiClock />,
          title: "Cần xử lý ngay",
          value: draftOrders + submittedOrders,
          desc: "Ưu tiên kiểm tra đơn nháp và đơn đã gửi.",
          tone: "amber",
        },
        {
          icon: <FiShoppingCart />,
          title: "Đơn vừa phát sinh",
          value: recentOrders.length,
          desc: "Theo dõi nhanh các đơn mới nhất trong ngày làm việc.",
          tone: "blue",
        },
      ],
      week: [
        {
          icon: <FiTruck />,
          title: "Theo dõi tiến độ",
          value: approvedOrders,
          desc: "Các đơn đã duyệt nên được bám tiếp để qua kho/giao hàng.",
          tone: "emerald",
        },
        {
          icon: <FiAlertCircle />,
          title: "Rà soát tồn đọng",
          value: submittedOrders,
          desc: "Đơn submitted còn treo cần nhắc hoặc kiểm tra lại.",
          tone: "amber",
        },
      ],
      month: [
        {
          icon: <FiDollarSign />,
          title: "Mục tiêu doanh thu",
          value: `${formatCurrency(summary.total_revenue || 0)}đ`,
          desc: "Theo dõi kết quả bán hàng và đề xuất hành động tiếp theo.",
          tone: "emerald",
        },
        {
          icon: <FiXCircle />,
          title: "Đơn bị hủy",
          value: cancelledOrders,
          desc: "Nên tổng hợp nguyên nhân hủy để cải thiện tỉ lệ chốt đơn.",
          tone: "rose",
        },
      ],
    };

    return common[timeView] || common.today;
  }, [
    timeView,
    draftOrders,
    submittedOrders,
    approvedOrders,
    cancelledOrders,
    recentOrders.length,
    summary.total_revenue,
  ]);

  const timeViewLabel = {
    today: "Hôm nay",
    week: "7 ngày tới",
    month: "Tháng này",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">{roleName}</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Dashboard bán hàng
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Xin chào{" "}
              <span className="font-medium text-slate-700">{displayName}</span>,
              đây là màn hình tổng quan giúp bạn theo dõi công việc bán hàng,
              tiến độ đơn và các đầu việc cần ưu tiên.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/sales-orders/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <FiFileText />
              Tạo đơn mới
            </button>

            <button
              type="button"
              onClick={fetchStats}
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
          Đang tải dashboard bán hàng...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng khách hàng"
              value={summary.total_customers || 0}
              subtext="Khách hàng hiện có trong hệ thống"
              icon={<FiUsers size={20} />}
              tone="teal"
            />
            <StatCard
              title="Tổng đơn hàng"
              value={summary.total_orders || 0}
              subtext="Tất cả đơn hàng đã tạo"
              icon={<FiShoppingCart size={20} />}
              tone="blue"
            />
            <StatCard
              title="Đơn cần xử lý"
              value={draftOrders + submittedOrders}
              subtext="Nháp + đã gửi"
              icon={<FiClock size={20} />}
              tone="amber"
            />
            <StatCard
              title="Doanh thu tạm tính"
              value={`${formatCurrency(summary.total_revenue || 0)}đ`}
              subtext="Từ đơn đã duyệt / giao"
              icon={<FiDollarSign size={20} />}
              tone="emerald"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Tiến độ xử lý đơn hàng"
                desc="Theo dõi nhanh pipeline đơn hàng để biết việc nào đang bị dồn."
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PipelineCard
                  title="Đơn nháp"
                  count={draftOrders}
                  percent={toPercent(draftOrders)}
                  colorClass="bg-amber-400"
                />
                <PipelineCard
                  title="Đã gửi"
                  count={submittedOrders}
                  percent={toPercent(submittedOrders)}
                  colorClass="bg-blue-500"
                />
                <PipelineCard
                  title="Đã duyệt"
                  count={approvedOrders}
                  percent={toPercent(approvedOrders)}
                  colorClass="bg-emerald-500"
                />
                <PipelineCard
                  title="Đã hủy"
                  count={cancelledOrders}
                  percent={toPercent(cancelledOrders)}
                  colorClass="bg-rose-500"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle
                title="Lối tắt thao tác"
                desc="Đi nhanh tới các chức năng thường dùng nhất."
              />

              <div className="space-y-3">
                <QuickAction
                  title="Tạo đơn bán hàng"
                  desc="Tạo nhanh đơn mới cho khách hàng."
                  onClick={() => navigate("/sales-orders/create")}
                />
                <QuickAction
                  title="Danh sách đơn hàng"
                  desc="Xem và xử lý workflow đơn hàng."
                  onClick={() => navigate("/sales-orders")}
                />
                <QuickAction
                  title="Quản lý khách hàng"
                  desc="Cập nhật thông tin khách hàng phục vụ bán hàng."
                  onClick={() => navigate("/customers")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <SectionTitle
                    title="Đơn hàng gần đây"
                    desc="Những đơn mới nhất để bạn bám tiến độ nhanh."
                  />
                </div>

                {recentOrders.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-slate-500">
                    Chưa có đơn hàng nào để hiển thị.
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 text-left text-slate-600">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Mã đơn</th>
                          <th className="px-4 py-3 font-semibold">Khách hàng</th>
                          <th className="px-4 py-3 font-semibold">Nhân viên</th>
                          <th className="px-4 py-3 font-semibold">Tổng tiền</th>
                          <th className="px-4 py-3 font-semibold">Trạng thái</th>
                          <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                            onClick={() => navigate(`/sales-orders/${order.id}`)}
                          >
                            <td className="px-4 py-4 font-semibold text-slate-800">
                              {order.order_no}
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              {order.customer_name || "-"}
                            </td>
                            <td className="px-4 py-4 text-slate-700">
                              {order.employee_name || "-"}
                            </td>
                            <td className="px-4 py-4 font-medium text-slate-800">
                              {formatCurrency(order.total_amount)}đ
                            </td>
                            <td className="px-4 py-4">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-4 py-4 text-slate-600">
                              {formatDate(order.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">
                      Trọng tâm công việc
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Góc nhìn theo thời gian để định hướng xử lý.
                    </p>
                  </div>

                  <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
                    <button
                      type="button"
                      onClick={() => setTimeView("today")}
                      className={`rounded-lg px-3 py-1.5 ${
                        timeView === "today"
                          ? "bg-white font-medium text-slate-900 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Hôm nay
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeView("week")}
                      className={`rounded-lg px-3 py-1.5 ${
                        timeView === "week"
                          ? "bg-white font-medium text-slate-900 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      7 ngày
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeView("month")}
                      className={`rounded-lg px-3 py-1.5 ${
                        timeView === "month"
                          ? "bg-white font-medium text-slate-900 shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      Tháng
                    </button>
                  </div>
                </div>

                <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <FiCalendar />
                    {timeViewLabel[timeView]}
                  </div>
                  <div className="mt-1">
                    Đây là góc nhìn quản trị công việc theo chu kỳ để bạn ưu tiên xử lý phù hợp.
                  </div>
                </div>

                <div className="space-y-3">
                  {focusData.map((item) => (
                    <FocusItem key={item.title} {...item} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <SectionTitle
                  title="Gợi ý hành động"
                  desc="Một số ưu tiên nên làm ngay từ dashboard."
                />

                <div className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-800">1.</span> Kiểm tra
                    lại các đơn nháp để tránh bỏ sót cơ hội chốt đơn.
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-800">2.</span> Theo dõi
                    các đơn đã gửi nhưng chưa được duyệt để xử lý tiếp.
                  </div>
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-800">3.</span> Rà soát
                    các đơn bị hủy để rút kinh nghiệm cho chăm sóc khách hàng.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SalesDashboardPage;