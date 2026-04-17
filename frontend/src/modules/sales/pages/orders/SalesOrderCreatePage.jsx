import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiMinus,
  FiPackage,
  FiPlus,
  FiSave,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../../../context/AuthContext";
import CustomerSelect from "../../components/customers/CustomerSelect";
import { salesReferenceService } from "../../services/salesReferenceService";
import { salesOrderService } from "../../services/salesOrderService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function ProductSearchBox({
  keyword,
  setKeyword,
  productOptions,
  loadingProducts,
  onAddProduct,
  selectedProductIds,
  open,
  setOpen,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Thêm sản phẩm</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tìm nhanh theo mã hoặc tên sản phẩm và thêm trực tiếp vào đơn hàng.
          </p>
        </div>
      </div>

      <div className="relative">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tìm sản phẩm để thêm vào đơn hàng..."
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {open && (
        <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
          {loadingProducts ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Đang tải sản phẩm...
            </div>
          ) : productOptions.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {productOptions.map((product) => {
                const existed = selectedProductIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-4 bg-white px-4 py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
                        <FiPackage />
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900">
                          {product.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {product.product_code} • {product.unit_name || "-"}
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-700">
                          Giá bán: {formatCurrency(product.price)}đ
                        </div>
                        {product.category_name ? (
                          <div className="mt-1 text-xs text-slate-400">
                            Nhóm: {product.category_name}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={existed}
                      onClick={() => onAddProduct(product)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                        existed
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      <FiPlus />
                      {existed ? "Đã thêm" : "Thêm"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderItemRow({ item, onIncrease, onDecrease, onChangeQty, onRemove }) {
  const subtotal = Number(item.price || 0) * Number(item.quantity || 0);

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-4">
        <div className="font-semibold text-slate-900">{item.name}</div>
        <div className="mt-1 text-sm text-slate-500">
          {item.product_code} • {item.unit_name || "-"}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="text-xs uppercase tracking-wide text-slate-400">Đơn giá</div>
        <div className="mt-1 font-semibold text-slate-900">
          {formatCurrency(item.price)}đ
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="text-xs uppercase tracking-wide text-slate-400">Số lượng</div>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrease(item.product_id)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <FiMinus />
          </button>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onChangeQty(item.product_id, Math.max(1, Number(e.target.value || 1)))
            }
            className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-center outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />

          <button
            type="button"
            onClick={() => onIncrease(item.product_id)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="text-xs uppercase tracking-wide text-slate-400">Thành tiền</div>
        <div className="mt-1 font-semibold text-slate-900">
          {formatCurrency(subtotal)}đ
        </div>
      </div>

      <div className="lg:col-span-1 lg:text-right">
        <button
          type="button"
          onClick={() => onRemove(item.product_id)}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <FiTrash2 />
          <span className="lg:hidden">Xóa</span>
        </button>
      </div>
    </div>
  );
}

function SummaryBox({ items, saving, onSaveDraft, onSaveAndSubmit }) {
  const totalLines = items.length;
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  return (
    <div className="sticky top-6 space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Tổng kết đơn hàng</h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-600">Số dòng hàng</span>
            <span className="font-semibold text-slate-900">{totalLines}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-600">Tổng số lượng</span>
            <span className="font-semibold text-slate-900">{totalQty}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3">
            <span className="text-sm font-medium text-teal-700">Tổng tiền</span>
            <span className="text-lg font-bold text-teal-700">
              {formatCurrency(totalAmount)}đ
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Thao tác</h3>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSave />
            {saving ? "Đang xử lý..." : "Lưu đơn nháp"}
          </button>

          <button
            type="button"
            onClick={onSaveAndSubmit}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSend />
            {saving ? "Đang xử lý..." : "Lưu và gửi đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SalesOrderCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialCustomer = location.state?.preselectedCustomer || null;
  const initialProducts = Array.isArray(location.state?.preselectedProducts)
    ? location.state.preselectedProducts.map((product) => ({
        product_id: product.id,
        product_code: product.product_code,
        name: product.name,
        unit_name: product.unit_name,
        price: Number(product.price || 0),
        quantity: 1,
      }))
    : [];

  const [customer, setCustomer] = useState(initialCustomer);
  const [items, setItems] = useState(initialProducts);
  const [saving, setSaving] = useState(false);

  const employeeName =
    user?.employee?.name || user?.name || "Nhân viên đang đăng nhập";

  const [productKeyword, setProductKeyword] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [openProductBox, setOpenProductBox] = useState(true);

  const selectedProductIds = useMemo(
    () => items.map((item) => item.product_id),
    [items]
  );

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!openProductBox) return;

      setLoadingProducts(true);
      try {
        const data = await salesReferenceService.getProducts({
          q: productKeyword,
          limit: 10,
        });
        setProductOptions(data);
      } catch (error) {
        setProductOptions([]);
      } finally {
        setLoadingProducts(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [productKeyword, openProductBox]);

  const addProduct = (product) => {
    const existed = items.some((item) => item.product_id === product.id);

    if (existed) {
      toast.error("Sản phẩm đã có trong đơn hàng");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_code: product.product_code,
        name: product.name,
        unit_name: product.unit_name,
        price: Number(product.price || 0),
        quantity: 1,
      },
    ]);

    setProductKeyword("");
    setOpenProductBox(true);
  };

  const changeQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Number(item.quantity || 0) + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, Number(item.quantity || 1) - 1) }
          : item
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const resetForm = () => {
    setCustomer(null);
    setItems([]);
    setProductKeyword("");
  };

  const validateBeforeSubmit = () => {
    if (!customer?.id) {
      toast.error("Vui lòng chọn khách hàng");
      return false;
    }

    if (!items.length) {
      toast.error("Vui lòng thêm ít nhất 1 sản phẩm");
      return false;
    }

    const invalidQty = items.some((item) => Number(item.quantity) <= 0);
    if (invalidQty) {
      toast.error("Số lượng sản phẩm phải lớn hơn 0");
      return false;
    }

    return true;
  };

  const handleCreateOrder = async (submitAfterCreate = false) => {
    if (!validateBeforeSubmit()) return;

    setSaving(true);

    try {
      const payload = {
        customer_id: customer.id,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: Number(item.quantity),
        })),
      };

      const created = await salesOrderService.create(payload);
      const orderId = created?.data?.id;

      if (submitAfterCreate && orderId) {
        await salesOrderService.submit(orderId);
        toast.success("Tạo và gửi đơn hàng thành công");
      } else {
        toast.success("Tạo đơn hàng thành công");
      }

      resetForm();

      if (orderId) {
        navigate(`/sales-orders/${orderId}`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi tạo đơn hàng"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-sm font-medium text-teal-600">Tạo mới đơn bán hàng</div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Tạo đơn hàng</h1>
            <p className="mt-2 text-sm text-slate-500">
              Chọn khách hàng, thêm sản phẩm trực tiếp và lưu đơn theo quy trình bán hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/sales-orders")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiX />
            Đóng
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Thông tin chung</h2>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <CustomerSelect value={customer} onChange={setCustomer} />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nhân viên bán hàng
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="rounded-xl bg-teal-50 p-2 text-teal-600">
                    <FiUser />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{employeeName}</div>
                    <div className="text-xs text-slate-500">
                      Tự động lấy theo tài khoản đăng nhập
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductSearchBox
            keyword={productKeyword}
            setKeyword={setProductKeyword}
            productOptions={productOptions}
            loadingProducts={loadingProducts}
            onAddProduct={addProduct}
            selectedProductIds={selectedProductIds}
            open={openProductBox}
            setOpen={setOpenProductBox}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Danh sách sản phẩm đã chọn
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Chỉnh số lượng trực tiếp trước khi lưu đơn.
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <FiPackage size={24} />
                </div>
                <div className="mt-4 text-base font-semibold text-slate-800">
                  Chưa có sản phẩm nào
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  Hãy tìm sản phẩm ở khung trên và thêm trực tiếp vào đơn hàng.
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <OrderItemRow
                    key={item.product_id}
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onChangeQty={changeQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-4">
          <SummaryBox
            items={items}
            saving={saving}
            onSaveDraft={() => handleCreateOrder(false)}
            onSaveAndSubmit={() => handleCreateOrder(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesOrderCreatePage;