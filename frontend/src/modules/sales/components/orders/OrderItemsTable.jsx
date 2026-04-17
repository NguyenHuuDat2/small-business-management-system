import { FiTrash2 } from "react-icons/fi";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function OrderItemsTable({ items, onChangeQuantity, onRemove }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Chưa có sản phẩm nào trong đơn hàng. Hãy bấm <strong>Thêm sản phẩm</strong>.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Sản phẩm</th>
              <th className="px-4 py-3 font-semibold">Đơn vị</th>
              <th className="px-4 py-3 font-semibold">Giá bán</th>
              <th className="px-4 py-3 font-semibold">Số lượng</th>
              <th className="px-4 py-3 font-semibold">Thành tiền</th>
              <th className="px-4 py-3 font-semibold text-center">Xóa</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const subtotal = (item.price || 0) * (item.quantity || 0);

              return (
                <tr key={item.product_id} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.product_code}</div>
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
                        onChangeQuantity(
                          item.product_id,
                          Math.max(1, Number(e.target.value || 1))
                        )
                      }
                      className="w-24 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </td>

                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {formatCurrency(subtotal)}đ
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onRemove(item.product_id)}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderItemsTable;