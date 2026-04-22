import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiPackage,
  FiPlus,
  FiSave,
  FiSend,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { useAuth } from "../../../../context/AuthContext";
import { salesReferenceService } from "../../services/salesReferenceService";
import { salesOrderService } from "../../services/salesOrderService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

const PAYMENT_METHODS = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank_transfer", label: "Chuyển khoản" },
  { value: "debt", label: "Công nợ" },
];

function SalesOrderCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const creatorName = user?.employee?.name || user?.name || "Nhân viên";
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    order_date: today,
    customer_id: "",
    customer_phone: "",
    customer_address: "",
    payment_method: "cash", // chỉ dùng ở giao diện, không lưu DB cũ
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productKeyword, setProductKeyword] = useState("");
  const [items, setItems] = useState([]);
  const [loadingRef, setLoadingRef] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadReferenceData = async () => {
      setLoadingRef(true);

      try {
        const [customerRes, productRes] = await Promise.all([
          salesReferenceService.getCustomers({ q: "", limit: 100 }),
          salesReferenceService.getProducts({ q: "", limit: 100 }),
        ]);

        setCustomers(Array.isArray(customerRes) ? customerRes : customerRes?.data || []);
        setProducts(Array.isArray(productRes) ? productRes : productRes?.data || []);
      } catch (error) {
        toast.error("Không thể tải dữ liệu khách hàng hoặc sản phẩm");
      } finally {
        setLoadingRef(false);
      }
    };

    loadReferenceData();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = productKeyword.trim().toLowerCase();

    if (!keyword) return products;

    return products.filter((product) => {
      const code = String(product.product_code || "").toLowerCase();
      const name = String(product.name || "").toLowerCase();
      return code.includes(keyword) || name.includes(keyword);
    });
  }, [productKeyword, products]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);
  }, [items]);

  const handleChangeForm = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectCustomer = (customerId) => {
    const selected = customers.find((item) => String(item.id) === String(customerId));

    setForm((prev) => ({
      ...prev,
      customer_id: customerId,
      customer_phone: selected?.phone || "",
      customer_address: selected?.address || "",
    }));
  };

  const handleAddProduct = (product) => {
    const existed = items.find((item) => item.product_id === product.id);

    if (existed) {
      setItems((prev) =>
        prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: Number(item.quantity || 0) + 1 }
            : item
        )
      );
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_code: product.product_code,
        product_name: product.name,
        unit_name: product.unit_name || "",
        price: Number(product.price || 0),
        quantity: 1,
      },
    ]);
  };

  const handleChangeQuantity = (productId, quantity) => {
    const nextQty = Math.max(1, Number(quantity || 1));

    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: nextQty }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const validateForm = () => {
    if (!form.customer_id) {
      toast.error("Vui lòng chọn khách hàng");
      return false;
    }

    if (items.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 hàng hóa");
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    return {
      customer_id: Number(form.customer_id),
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: Number(item.quantity),
      })),
    };
  };

  const handleSave = async (submitAfterCreate = false) => {
    if (!validateForm()) return;

    setSaving(true);

    try {
      const payload = buildPayload();
      const created = await salesOrderService.create(payload);
      const orderId = created?.data?.id || created?.id;

      if (submitAfterCreate && orderId) {
        await salesOrderService.submit(orderId);
        toast.success("Tạo và gửi đơn hàng thành công");
      } else {
        toast.success("Lưu đơn hàng thành công");
      }

      if (orderId) {
        navigate(`/sales-orders/${orderId}`);
      } else {
        navigate("/sales-orders");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tạo đơn hàng"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">Nghiệp vụ bán hàng</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Tạo đơn hàng</h1>
            <p className="mt-2 text-sm text-slate-500">
              Form tạo đơn hàng ngắn gọn, dùng đúng dữ liệu hiện có trong hệ thống.
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
        <h2 className="text-lg font-semibold text-slate-900">Thông tin đơn hàng</h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Người tạo
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-600">
                <FiUser />
              </div>
              <span className="font-medium text-slate-900">{creatorName}</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Ngày phiếu
            </label>
            <input
              type="date"
              value={form.order_date}
              onChange={(e) => handleChangeForm("order_date", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
            <div className="mt-1 text-xs text-slate-400">
              Chỉ hiển thị trên form. Khi lưu, hệ thống dùng thời gian tạo đơn.
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Số phiếu
            </label>
            <input
              value="Tự sinh khi lưu đơn"
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Khách hàng
            </label>
            <select
              value={form.customer_id}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">Chọn khách hàng</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone || "Không có SĐT"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              SĐT khách hàng
            </label>
            <input
              value={form.customer_phone}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="Tự lấy từ khách hàng"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              PT thanh toán
            </label>
            <select
              value={form.payment_method}
              onChange={(e) => handleChangeForm("payment_method", e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
            <div className="mt-1 text-xs text-slate-400">
              Trường này hiện chỉ hiển thị ở giao diện, DB cũ chưa lưu.
            </div>
          </div>

          <div className="md:col-span-2 xl:col-span-3">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Địa chỉ khách hàng
            </label>
            <input
              value={form.customer_address}
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              placeholder="Tự lấy từ khách hàng"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Hàng hóa</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tìm và thêm hàng hóa trực tiếp vào đơn hàng.
            </p>
          </div>

          <div className="w-full lg:w-[360px]">
            <input
              value={productKeyword}
              onChange={(e) => setProductKeyword(e.target.value)}
              placeholder="Tìm theo mã hoặc tên hàng hóa..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div className="mt-5 grid max-h-[280px] grid-cols-1 gap-3 overflow-auto rounded-2xl border border-slate-200 p-4 md:grid-cols-2">
          {loadingRef ? (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              Đang tải danh mục sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-slate-500">
              Không có hàng hóa phù hợp.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {product.product_code} • {product.unit_name || "-"} •{" "}
                    {formatCurrency(product.price)}đ
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
                >
                  <FiPlus />
                  Thêm
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Danh sách hàng hóa</h2>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FiPackage size={22} />
            </div>
            <div className="mt-4 text-base font-semibold text-slate-800">
              Chưa có hàng hóa nào
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Hãy thêm hàng hóa ở phần trên để tạo đơn hàng.
            </div>
          </div>
        ) : (
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
                  <th className="px-4 py-3 font-semibold text-center">Xóa</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const subtotal = Number(item.price || 0) * Number(item.quantity || 0);

                  return (
                    <tr key={item.product_id} className="border-t border-slate-100">
                      <td className="px-4 py-4 font-medium text-slate-700">
                        {item.product_code}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {item.unit_name || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatCurrency(item.price)}đ
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleChangeQuantity(item.product_id, e.target.value)
                          }
                          className="w-24 rounded-lg border border-slate-200 px-3 py-2 outline-none"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">
                        {formatCurrency(subtotal)}đ
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          Chờ xử lý
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.product_id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan="5" className="px-4 py-4 text-right font-semibold text-slate-700">
                    Tổng cộng
                  </td>
                  <td className="px-4 py-4 text-lg font-bold text-teal-700">
                    {formatCurrency(totalAmount)}đ
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(false)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <FiSave />
          {saving ? "Đang xử lý..." : "Lưu đơn nháp"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          <FiSend />
          {saving ? "Đang xử lý..." : "Lưu và gửi đơn"}
        </button>
      </div>
    </div>
  );
}

export default SalesOrderCreatePage;