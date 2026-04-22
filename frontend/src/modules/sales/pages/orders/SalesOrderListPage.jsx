import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiFilter,
  FiFileText,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiShoppingCart,
  FiSlash,
  FiUsers,
} from "react-icons/fi";

import { useAuth } from "../../../../context/AuthContext";
import { useSalesOrders } from "../../hooks/useSalesOrders";
import { salesOrderService } from "../../services/salesOrderService";
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

function SummaryCard({ title, value, icon, tone = "slate", subText }) {
  const tones = {
    slate: "bg-slate-50 text-slate-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          {subText ? (
            <div className="mt-2 text-xs text-slate-400">{subText}</div>
          ) : null}
        </div>

        <div className={`rounded-2xl p-3 ${tones[tone] || tones.slate}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "draft", label: "Nháp" },
  { value: "submitted", label: "Đã gửi" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
  { value: "sent_to_warehouse", label: "Đã gửi kho" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "completed", label: "Hoàn tất" },
];

const QUICK_FILTERS = [
  { value: "", label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "submitted", label: "Đã gửi" },
  { value: "approved", label: "Đã duyệt" },
  { value: "cancelled", label: "Đã hủy" },
];

function SalesOrderListPage() {
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const employeeName =
    user?.employee?.name || user?.name || "Nhân viên đang đăng nhập";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  const queryParams = useMemo(
    () => ({
      q: debouncedKeyword,
      status,
      page,
      per_page: 10,
    }),
    [debouncedKeyword, status, page]
  );

  const { orders, pagination, loading, error, refresh } =
    useSalesOrders(queryParams);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const visibleStats = useMemo(() => {
    const totalValue = (orders || []).reduce(
      (sum, item) => sum + Number(item.total_amount || 0),
      0
    );

    const draftCount = (orders || []).filter(
      (item) => item.status === "draft"
    ).length;
    const submittedCount = (orders || []).filter(
      (item) => item.status === "submitted"
    ).length;
    const approvedCount = (orders || []).filter(
      (item) => item.status === "approved"
    ).length;

    return {
      totalValue,
      draftCount,
      submittedCount,
      approvedCount,
    };
  }, [orders]);

  const handleAction = async (type, orderId, successMessage) => {
    setActionLoadingId(orderId);

    try {
      if (type === "submit") {
        await salesOrderService.submit(orderId);
      } else if (type === "approve") {
        await salesOrderService.approve(orderId);
      } else if (type === "cancel") {
        await salesOrderService.cancel(orderId);
      }

      toast.success(successMessage);
      refresh();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Thao tác không thành công"
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const canCreateOrder = hasPermission("sales.orders.create");
  const canSubmitOrder = hasPermission("sales.orders.submit_to_warehouse");
  const canApproveOrder = hasPermission("sales.orders.update");
  const canCancelOrder = hasPermission("sales.orders.update");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">
              Quản lý bán hàng
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Đơn bán hàng
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Chỉ hiển thị các đơn hàng do{" "}
              <span className="font-medium text-slate-700">{employeeName}</span>{" "}
              tạo ra.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <FiRefreshCw />
              Làm mới
            </button>

            {canCreateOrder && (
              <button
                type="button"
                onClick={() => navigate("/sales-orders/create")}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <FiPlus />
                Tạo đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Tổng đơn đang xem"
          value={pagination.total || 0}
          subText="Theo bộ lọc hiện tại"
          icon={<FiFileText size={20} />}
          tone="teal"
        />
        <SummaryCard
          title="Giá trị hiển thị"
          value={`${formatCurrency(visibleStats.totalValue)}đ`}
          subText="Tổng tiền của các đơn đang hiển thị"
          icon={<FiShoppingCart size={20} />}
          tone="blue"
        />
        <SummaryCard
          title="Đơn nháp / đã gửi"
          value={`${visibleStats.draftCount} / ${visibleStats.submittedCount}`}
          subText="Cần ưu tiên xử lý"
          icon={<FiClock size={20} />}
          tone="amber"
        />
        <SummaryCard
          title="Đã duyệt"
          value={visibleStats.approvedCount}
          subText="Sẵn sàng theo dõi tiếp sang kho"
          icon={<FiUsers size={20} />}
          tone="slate"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="relative xl:col-span-7">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, số điện thoại..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div className="xl:col-span-3">
            <div className="relative">
              <FiFilter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="xl:col-span-2">
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setDebouncedKeyword("");
                setStatus("");
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Xóa lọc
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((item) => {
            const active = status === item.value;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setStatus(item.value);
                  setPage(1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">
              Danh sách đơn hàng
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Chỉ hiển thị đơn hàng của nhân viên đang đăng nhập
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Tổng:{" "}
            <span className="font-semibold text-slate-900">
              {pagination.total}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Đang tải danh sách đơn hàng...
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-rose-500">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FiFileText size={22} />
            </div>
            <div className="mt-4 text-base font-semibold text-slate-800">
              Chưa có đơn hàng phù hợp
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Thử đổi bộ lọc hoặc tạo mới đơn hàng để bắt đầu.
            </div>

            {canCreateOrder && (
              <button
                type="button"
                onClick={() => navigate("/sales-orders/create")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700"
              >
                <FiPlus />
                Tạo đơn hàng đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-4 font-semibold">Mã đơn</th>
                  <th className="px-4 py-4 font-semibold">Khách hàng</th>
                  <th className="px-4 py-4 font-semibold">Nhân viên</th>
                  <th className="px-4 py-4 font-semibold">Tổng tiền</th>
                  <th className="px-4 py-4 font-semibold">Trạng thái</th>
                  <th className="px-4 py-4 font-semibold">Ngày tạo</th>
                  <th className="px-4 py-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const busy = actionLoadingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className="border-t border-slate-100 align-top hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-5">
                        <div className="font-semibold text-slate-900">
                          {order.order_no}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          Mã nhận diện đơn hàng
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="font-medium text-slate-900">
                          {order.customer_name || "-"}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {order.customer_phone || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-5">
                        <div className="font-medium text-slate-800">
                          {order.employee_name || "-"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          Nhân viên phụ trách
                        </div>
                      </td>

                      <td className="px-4 py-5 font-semibold text-slate-900">
                        {formatCurrency(order.total_amount)}đ
                      </td>

                      <td className="px-4 py-5">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="px-4 py-5 text-slate-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/sales-orders/${order.id}`)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <FiEye />
                            Xem
                          </button>

                          {order.status === "draft" && canSubmitOrder && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                handleAction(
                                  "submit",
                                  order.id,
                                  "Đã gửi đơn hàng thành công"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-amber-600 disabled:opacity-60"
                            >
                              <FiSend />
                              Gửi
                            </button>
                          )}

                          {order.status === "submitted" && canApproveOrder && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                handleAction(
                                  "approve",
                                  order.id,
                                  "Đã duyệt đơn hàng"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                            >
                              <FiCheckCircle />
                              Duyệt
                            </button>
                          )}

                          {!["cancelled", "delivered", "sent_to_warehouse"].includes(
                            order.status
                          ) && canCancelOrder && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                handleAction(
                                  "cancel",
                                  order.id,
                                  "Đã hủy đơn hàng"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
                            >
                              <FiSlash />
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Trang{" "}
            <span className="font-semibold text-slate-900">
              {pagination.current_page}
            </span>{" "}
            /{" "}
            <span className="font-semibold text-slate-900">
              {pagination.last_page}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft />
              Trước
            </button>

            <button
              type="button"
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() =>
                setPage((prev) => Math.min(pagination.last_page, prev + 1))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderListPage;