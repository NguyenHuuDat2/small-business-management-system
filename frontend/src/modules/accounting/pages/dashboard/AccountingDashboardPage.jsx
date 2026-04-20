import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiRefreshCw,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";
import invoiceService from "../../services/invoiceService";
import {
  calcOverdueDays,
  estimateDueDate,
  formatCurrency,
  formatDate,
  getInvoiceStatusMeta,
  toNumber,
} from "../../utils/accountingHelpers";

function StatCard({ icon, label, value, hint, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
        </div>
        <div className={`rounded-xl p-3 ${tone}`}>{icon}</div>
      </div>
    </div>
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

function TrendRow({ label, value, max }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <p className="font-medium text-slate-700">{label}</p>
        <p className="text-slate-500">{formatCurrency(value)}</p>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-teal-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function AccountingDashboardPage() {
  const [overview, setOverview] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    cancelledInvoices: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [allRes, paidRes, pendingRes, cancelledRes, recentRes] =
        await Promise.all([
          invoiceService.list({ page: 1, per_page: 1 }),
          invoiceService.list({ page: 1, per_page: 1, status: "Paid" }),
          invoiceService.list({ page: 1, per_page: 1, status: "Pending" }),
          invoiceService.list({ page: 1, per_page: 1, status: "Cancelled" }),
          invoiceService.list({ page: 1, per_page: 80 }),
        ]);

      setOverview({
        totalInvoices: toNumber(allRes?.data?.total),
        paidInvoices: toNumber(paidRes?.data?.total),
        pendingInvoices: toNumber(pendingRes?.data?.total),
        cancelledInvoices: toNumber(cancelledRes?.data?.total),
      });
      setRecentInvoices(recentRes?.data?.data || []);
    } catch {
      setError("Khong tai duoc du lieu tong quan ke toan");
      setOverview({
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        cancelledInvoices: 0,
      });
      setRecentInvoices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const financeStats = useMemo(() => {
    const paidAmount = recentInvoices
      .filter((item) => item.status === "Paid")
      .reduce((sum, item) => sum + toNumber(item.total_amount), 0);
    const pendingAmount = recentInvoices
      .filter((item) => item.status === "Pending")
      .reduce((sum, item) => sum + toNumber(item.total_amount), 0);
    const cancelledAmount = recentInvoices
      .filter((item) => item.status === "Cancelled")
      .reduce((sum, item) => sum + toNumber(item.total_amount), 0);
    const grossAmount = paidAmount + pendingAmount + cancelledAmount;
    const collectionRate =
      grossAmount > 0 ? Math.round((paidAmount / grossAmount) * 100) : 0;

    return {
      paidAmount,
      pendingAmount,
      grossAmount,
      collectionRate,
    };
  }, [recentInvoices]);

  const monthTrend = useMemo(() => {
    const rows = [];
    const now = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      rows.push({
        key,
        label: `Thang ${date.getMonth() + 1}/${date.getFullYear()}`,
        total: 0,
      });
    }

    const bucketMap = Object.fromEntries(rows.map((row) => [row.key, row]));

    recentInvoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.created_at);
      if (Number.isNaN(invoiceDate.getTime())) return;
      const key = `${invoiceDate.getFullYear()}-${String(
        invoiceDate.getMonth() + 1
      ).padStart(2, "0")}`;
      if (bucketMap[key]) {
        bucketMap[key].total += toNumber(invoice.total_amount);
      }
    });

    const maxValue = Math.max(...rows.map((row) => row.total), 1);
    return { rows, maxValue };
  }, [recentInvoices]);

  const receivablePreview = useMemo(() => {
    return recentInvoices
      .filter((invoice) => invoice.status === "Pending")
      .map((invoice) => {
        const dueDate = estimateDueDate(invoice.created_at, 7);
        const overdueDays = calcOverdueDays(dueDate);
        return {
          id: invoice.id,
          invoiceNo: invoice.invoice_no,
          customerName: invoice.customer?.name || "Khach le",
          dueDate,
          overdueDays,
          amount: toNumber(invoice.total_amount),
        };
      })
      .sort((a, b) => b.overdueDays - a.overdueDays)
      .slice(0, 6);
  }, [recentInvoices]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Dang tai dashboard ke toan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Tong quan ke toan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Theo doi doanh thu, cong no va tinh hinh thanh toan theo hoa don.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
              Lam moi
            </button>
            <Link
              to="/accounting/invoices"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Quan ly hoa don
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<FiFileText className="text-xl" />}
          label="Tong hoa don"
          value={overview.totalInvoices}
          hint="Tinh theo du lieu he thong"
          tone="bg-sky-100 text-sky-700"
        />
        <StatCard
          icon={<FiCheckCircle className="text-xl" />}
          label="Da thanh toan"
          value={overview.paidInvoices}
          hint={`${financeStats.collectionRate}% ty le thu`}
          tone="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={<FiClock className="text-xl" />}
          label="Cho thanh toan"
          value={overview.pendingInvoices}
          hint={formatCurrency(financeStats.pendingAmount)}
          tone="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={<FiXCircle className="text-xl" />}
          label="Da huy"
          value={overview.cancelledInvoices}
          hint="Can kiem tra cong no lien quan"
          tone="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={<FiTrendingUp className="text-xl" />}
          label="Tong gia tri"
          value={formatCurrency(financeStats.grossAmount)}
          hint={`Da thu ${formatCurrency(financeStats.paidAmount)}`}
          tone="bg-indigo-100 text-indigo-700"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Gia tri hoa don 6 thang
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tong gia tri phat hanh tren tap hoa don gan day.
            </p>
          </div>
          <div className="space-y-3">
            {monthTrend.rows.map((item) => (
              <TrendRow
                key={item.key}
                label={item.label}
                value={item.total}
                max={monthTrend.maxValue}
              />
            ))}
          </div>
        </div>

        <div className="xl:col-span-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Hoa don gan day
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Theo doi nhanh trang thai phat hanh hoa don.
              </p>
            </div>
            <Link
              to="/accounting/invoices"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Xem tat ca
            </Link>
          </div>

          <div className="space-y-3">
            {recentInvoices.slice(0, 8).map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-xl border border-slate-100 p-3 transition hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {invoice.invoice_no}
                    </p>
                    <p className="text-sm text-slate-500">
                      {invoice.customer?.name || "Khach le"} -{" "}
                      {formatDate(invoice.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-700">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                    <StatusBadge status={invoice.status} />
                  </div>
                </div>
              </div>
            ))}

            {recentInvoices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
                Chua co du lieu hoa don.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Cong no sap den han
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Danh sach hoa don chua thu trong 7 ngay han thanh toan.
            </p>
          </div>
          <Link
            to="/accounting/receivables"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            Mo cong no
          </Link>
        </div>

        <div className="space-y-3">
          {receivablePreview.length > 0 ? (
            receivablePreview.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {item.invoiceNo} - {item.customerName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Den han: {formatDate(item.dueDate)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      item.overdueDays > 0
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.overdueDays > 0
                      ? `Qua han ${item.overdueDays} ngay`
                      : item.overdueDays === 0
                      ? "Den han hom nay"
                      : `Con ${Math.abs(item.overdueDays)} ngay`}
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              Chua co hoa don dang cho thanh toan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountingDashboardPage;
