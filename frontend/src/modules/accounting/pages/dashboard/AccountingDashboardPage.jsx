import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiArrowRight,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

import { useAuth } from "../../../../context/AuthContext";
import { accountingDashboardService } from "../../services/accountingDashboardService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function formatDateTime(value) {
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
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          {subtext ? <div className="mt-2 text-xs text-slate-400">{subtext}</div> : null}
        </div>

        <div className={`rounded-2xl p-3 ${tones[tone] || tones.teal}`}>{icon}</div>
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

function AccountingDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const displayName = user?.employee?.name || user?.name || "Kế toán";

  const fetchStats = async () => {
    setLoading(true);

    try {
      const response = await accountingDashboardService.getStats();
      setStats(response?.data || null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải dashboard kế toán"
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
  const recentInvoices = stats?.recent_invoices || [];
  const recentPayments = stats?.recent_payments || [];

  const collectionRate = useMemo(() => {
    const total = Number(summary.total_invoice_amount || 0);
    const collected = Number(summary.total_collected || 0);

    if (!total) return 0;

    return Math.min(100, Math.round((collected / total) * 100));
  }, [summary.total_invoice_amount, summary.total_collected]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">Kế toán</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Dashboard kế toán</h1>
            <p className="mt-2 text-sm text-slate-500">
              Xin chào <span className="font-medium text-slate-700">{displayName}</span>,
              màn hình này giúp bạn theo dõi tình hình hóa đơn, thanh toán và công
              nợ cần xử lý trong ngày.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/accounting/invoices")}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              <FiFileText />
              Quản lý hóa đơn
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
          Đang tải dashboard kế toán...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Tổng hóa đơn"
              value={summary.total_invoices || 0}
              subtext="Số hóa đơn đã phát hành"
              icon={<FiFileText size={20} />}
              tone="teal"
            />
            <StatCard
              title="Đã thu tiền"
              value={`${formatCurrency(summary.total_collected || 0)}đ`}
              subtext="Tổng tiền thanh toán thành công"
              icon={<FiDollarSign size={20} />}
              tone="emerald"
            />
            <StatCard
              title="Còn phải thu"
              value={`${formatCurrency(summary.total_receivable || 0)}đ`}
              subtext="Công nợ chưa thu"
              icon={<FiActivity size={20} />}
              tone="amber"
            />
            <StatCard
              title="Tổng thanh toán"
              value={summary.total_payments || 0}
              subtext="Số giao dịch đã ghi nhận"
              icon={<FiCreditCard size={20} />}
              tone="blue"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">Hiệu suất thu hồi công nợ</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tỷ lệ thu tiền trên tổng giá trị hóa đơn chưa hủy.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-600">Tỷ lệ thu hồi</div>
                  <div className="text-2xl font-bold text-slate-900">{collectionRate}%</div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${collectionRate}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs text-slate-500">Hóa đơn chưa thu đủ</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {summary.unpaid_invoices || 0}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs text-slate-500">Hóa đơn đã thu đủ</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {summary.paid_invoices || 0}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs text-slate-500">Tổng hóa đơn</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {summary.total_invoices || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">Lối tắt thao tác</h2>
                <p className="mt-1 text-sm text-slate-500">Đi nhanh tới các màn hình chính.</p>
              </div>

              <div className="space-y-3">
                <QuickAction
                  title="Danh sách hóa đơn"
                  desc="Tạo, sửa, xóa và cập nhật trạng thái hóa đơn."
                  onClick={() => navigate("/accounting/invoices")}
                />
                <QuickAction
                  title="Danh sách thanh toán"
                  desc="Theo dõi và điều chỉnh các giao dịch đã ghi nhận."
                  onClick={() => navigate("/accounting/payments")}
                />
                <QuickAction
                  title="Công nợ phải thu"
                  desc="Rà soát các hóa đơn còn số dư cần thu."
                  onClick={() => navigate("/accounting/receivables")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">Hóa đơn gần đây</h2>
              </div>

              {recentInvoices.length === 0 ? (
                <div className="px-5 py-8 text-sm text-slate-500">Chưa có dữ liệu hóa đơn.</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Mã hóa đơn</th>
                        <th className="px-4 py-3 font-semibold">Khách hàng</th>
                        <th className="px-4 py-3 font-semibold">Giá trị</th>
                        <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-medium text-slate-700">{item.invoice_no}</td>
                          <td className="px-4 py-3 text-slate-600">{item.customer_name || "-"}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {formatCurrency(item.total_amount)}đ
                          </td>
                          <td className="px-4 py-3 text-slate-500">{formatDateTime(item.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">Thanh toán gần đây</h2>
              </div>

              {recentPayments.length === 0 ? (
                <div className="px-5 py-8 text-sm text-slate-500">Chưa có dữ liệu thanh toán.</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-left text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Mã thanh toán</th>
                        <th className="px-4 py-3 font-semibold">Hóa đơn</th>
                        <th className="px-4 py-3 font-semibold">Số tiền</th>
                        <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-medium text-slate-700">{item.payment_no}</td>
                          <td className="px-4 py-3 text-slate-600">{item.invoice_no || "-"}</td>
                          <td className="px-4 py-3 text-slate-700">{formatCurrency(item.amount)}đ</td>
                          <td className="px-4 py-3 text-slate-500">{formatDateTime(item.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <FiTrendingUp />
              Gợi ý vận hành
            </div>
            <p className="mt-1">
              Các hóa đơn có trạng thái "issued" hoặc "partial" nên được ưu tiên nhắc thu
              để cải thiện vòng quay tiền mặt.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default AccountingDashboardPage;
