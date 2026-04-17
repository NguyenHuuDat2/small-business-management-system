import { useEffect, useMemo, useState } from "react";
import { FiPackage, FiRefreshCw, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { productService } from "../../services/productService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function ProductListPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword]);

  const params = useMemo(
    () => ({
      q: debouncedKeyword,
      page,
      per_page: 10,
    }),
    [debouncedKeyword, page]
  );

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await productService.getList(params);
      setData(response?.data || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể tải danh sách sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.q, params.page]);

  const products = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
              <FiPackage size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
              <p className="mt-1 text-sm text-slate-500">
                Tra cứu thông tin sản phẩm để phục vụ bán hàng và tạo đơn nhanh hơn.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiRefreshCw />
            Làm mới
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã, tên, nhóm sản phẩm..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="text-sm text-slate-600">
            Tổng sản phẩm:{" "}
            <span className="font-semibold text-slate-900">{data?.total || 0}</span>
          </div>
        </div>

        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Đang tải danh sách sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            Không có sản phẩm phù hợp.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mã SP</th>
                  <th className="px-4 py-3 font-semibold">Tên sản phẩm</th>
                  <th className="px-4 py-3 font-semibold">Nhóm</th>
                  <th className="px-4 py-3 font-semibold">Đơn vị</th>
                  <th className="px-4 py-3 font-semibold">Giá bán</th>
                  <th className="px-4 py-3 font-semibold">Ghi nhận</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {product.product_code}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {product.category_name || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {product.unit_name || "-"}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {formatCurrency(product.price)}đ
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {product.is_returnable ? "Có hoàn vỏ/bình" : "Thông thường"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Trang {data?.current_page || 1} / {data?.last_page || 1}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={(data?.current_page || 1) <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>

            <button
              type="button"
              disabled={(data?.current_page || 1) >= (data?.last_page || 1)}
              onClick={() =>
                setPage((prev) => Math.min(data?.last_page || 1, prev + 1))
              }
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;