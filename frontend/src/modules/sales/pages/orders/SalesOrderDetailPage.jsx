import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowLeft, FiFileText, FiUser } from "react-icons/fi";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { salesOrderService } from "../../services/salesOrderService";

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

function mapPaymentMethod(value) {
  const map = {
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản",
    debt: "Công nợ",
  };

  return map[value] || "Chưa lưu trong DB";
}

function SalesOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);

      try {
        const response = await salesOrderService.getById(id);
        setOrder(response?.data || null);
      } catch (error) {
        toast.error("Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  const totalAmount = useMemo(() => {
    return (order?.items || []).reduce((sum, item) => {
      return sum + Number(item.subtotal || 0);
    }, 0);
  }, [order]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">Chi tiết đơn hàng</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {order.order_no || "Đơn hàng"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Xem lại thông tin đơn hàng và danh sách hàng hóa đã lưu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/sales-orders")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiArrowLeft />
            Quay lại
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <div className="text-sm text-slate-500">Người tạo</div>
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <FiUser />
              </div>
              <div className="font-medium text-slate-900">
                {order.employee?.name || "-"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Ngày phiếu</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {formatDate(order.created_at)}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Số phiếu</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {order.order_no || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">Khách hàng</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {order.customer?.name || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">SĐT khách hàng</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {order.customer?.phone || "-"}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">PT thanh toán</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {mapPaymentMethod(order.payment_method)}
            </div>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <div className="text-sm text-slate-500">Địa chỉ khách hàng</div>
            <div className="mt-2 rounded-xl bg-slate-50 px-4 py-3 font-medium text-slate-900">
              {order.customer?.address || "-"}
            </div>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <div className="text-sm text-slate-500">Trạng thái đơn hàng</div>
            <div className="mt-2">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
              <FiFileText />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Danh sách hàng hóa</h2>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Mã HH</th>
                <th className="px-4 py-3 font-semibold">Tên HH</th>
                <th className="px-4 py-3 font-semibold">ĐVT</th>
                <th className="px-4 py-3 font-semibold">Giá gốc</th>
                <th className="px-4 py-3 font-semibold">Số lượng</th>
                <th className="px-4 py-3 font-semibold">Thành tiền</th>
                <th className="px-4 py-3 font-semibold">Trạng thái hàng hóa</th>
              </tr>
            </thead>

            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item.id || item.product_id} className="border-t border-slate-100">
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {item.product_code || "-"}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {item.product_name || "-"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {item.unit_name || "-"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {formatCurrency(item.price)}đ
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {formatCurrency(item.subtotal)}đ
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {order.status === "draft"
                        ? "Nháp"
                        : order.status === "submitted"
                        ? "Đã gửi"
                        : order.status === "approved"
                        ? "Đã duyệt"
                        : order.status === "rejected"
                        ? "Từ chối"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : order.status === "delivered"
                        ? "Đã giao"
                        : "Chờ xử lý"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td colSpan="5" className="px-4 py-4 text-right font-semibold text-slate-700">
                  Tổng cộng
                </td>
                <td className="px-4 py-4 text-lg font-bold text-teal-700">
                  {formatCurrency(totalAmount)}đ
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderDetailPage;