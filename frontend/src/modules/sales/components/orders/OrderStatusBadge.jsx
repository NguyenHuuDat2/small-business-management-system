import { getOrderStatusMeta } from "../../constants/orderStatus";

function OrderStatusBadge({ status }) {
  const meta = getOrderStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export default OrderStatusBadge;