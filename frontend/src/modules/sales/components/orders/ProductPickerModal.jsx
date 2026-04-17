import { useEffect, useMemo, useState } from "react";
import { FiPackage, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { salesReferenceService } from "../../services/salesReferenceService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function ProductPickerModal({
  open,
  onClose,
  onSelectProduct,
  selectedProductIds = [],
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const selectedSet = useMemo(
    () => new Set(selectedProductIds),
    [selectedProductIds]
  );

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await salesReferenceService.getProducts({
          q: query,
          limit: 20,
        });
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [open, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Chọn sản phẩm</h3>
            <p className="text-sm text-slate-500">
              Tìm theo mã hoặc tên sản phẩm để thêm vào đơn hàng
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="border-b border-slate-100 px-6 py-4">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="overflow-auto px-6 py-4">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Đang tải sản phẩm...
            </div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const disabled = selectedSet.has(product.id);

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="rounded-xl bg-teal-50 p-3 text-teal-600">
                        <FiPackage />
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800">
                          {product.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {product.product_code} • {product.unit_name || "N/A"}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          Giá bán:{" "}
                          <span className="font-medium text-slate-800">
                            {formatCurrency(product.price)}đ
                          </span>
                        </div>
                        {product.category_name && (
                          <div className="mt-1 text-xs text-slate-400">
                            Nhóm: {product.category_name}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelectProduct(product)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                        disabled
                          ? "cursor-not-allowed bg-slate-100 text-slate-400"
                          : "bg-teal-600 text-white hover:bg-teal-700"
                      }`}
                    >
                      <FiPlus />
                      {disabled ? "Đã chọn" : "Thêm"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPickerModal;