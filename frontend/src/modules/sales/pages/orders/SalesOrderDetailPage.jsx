import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiSend,
  FiSlash,
} from "react-icons/fi";

import { salesOrderService } from "../../services/salesOrderService";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function SalesOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);

    try {
      const response = await salesOrderService.getDetail(id);
      setOrder(response?.data || null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải chi tiết đơn hàng"
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAction = async (type, successMessage) => {
    setActionLoading(true);

    try {
      if (type === "submit") {
        await salesOrderService.submit(id);
      } else if (type === "approve") {
        await salesOrderService.approve(id);
      } else if (type === "cancel") {
        await salesOrderService.cancel(id);
      }

      toast.success(successMessage);
      fetchDetail();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Thao tác không thành công"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/sales-orders")}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700"
            >
              <FiArrowLeft />
              Quay lại danh sách
            </button>

            <h1 className="text-2xl font-bold text-slate-900">
              Chi tiết đơn hàng {order.order_no}
            </h1>

            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {order.status === "draft" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAction("submit", "Đã gửi đơn hàng")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-amber-600 disabled:opacity-60"
              >
                <FiSend />
                Gửi đơn
              </button>
            )}

            {order.status === "submitted" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAction("approve", "Đã duyệt đơn hàng")}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                <FiCheckCircle />
                Duyệt đơn
              </button>
            )}

            {!["cancelled", "delivered", "sent_to_warehouse"].includes(order.status) && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAction("cancel", "Đã hủy đơn hàng")}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                <FiSlash />
                Hủy đơn
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Thông tin đơn hàng
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Khách hàng
                </div>
                <div className="mt-2 font-semibold text-slate-800">
                  {order.customer?.name || "-"}
                </div>
                <div className="text-sm text-slate-500">
                  {order.customer?.phone || "-"}
                </div>
                <div className="text-sm text-slate-500">
                  {order.customer?.address || "-"}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  Nhân viên bán hàng
                </div>
                <div className="mt-2 font-semibold text-slate-800">
                  {order.employee?.name || "-"}
                </div>
                <div className="text-sm text-slate-500">
                  {order.employee?.employee_code || "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Danh sách sản phẩm</h2>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Mã SP</th>
                    <th className="px-4 py-3 font-semibold">Tên sản phẩm</th>
                    <th className="px-4 py-3 font-semibold">Đơn vị</th>
                    <th className="px-4 py-3 font-semibold">Giá</th>
                    <th className="px-4 py-3 font-semibold">SL</th>
                    <th className="px-4 py-3 font-semibold">Thành tiền</th>
                  </tr>
                </thead>

                <tbody>
                  {(order.items || []).map((item) => (
                    <tr key={item.id || item.product_id} className="border-t border-slate-100">
                      <td className="px-4 py-4 text-slate-600">{item.product_code}</td>
                      <td className="px-4 py-4 font-medium text-slate-800">{item.product_name}</td>
                      <td className="px-4 py-4 text-slate-600">{item.unit_name || "-"}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatCurrency(item.price || item.current_price)}đ
                      </td>
                      <td className="px-4 py-4 text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {formatCurrency(item.subtotal)}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Tổng kết</h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Số dòng hàng</span>
                <span className="font-semibold text-slate-900">
                  {order.items?.length || 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Tổng tiền</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(order.total_amount)}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderDetailPage;