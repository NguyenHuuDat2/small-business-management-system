function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function OrderSummaryCard({ items }) {
  const totalLines = items.length;
  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const rows = [
    { label: "Số dòng hàng", value: totalLines },
    { label: "Tổng số lượng", value: totalQuantity },
    { label: "Tổng tiền", value: `${formatCurrency(totalAmount)}đ` },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Tổng kết đơn hàng</h3>

      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm text-slate-600">{row.label}</span>
            <span className="font-semibold text-slate-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderSummaryCard;