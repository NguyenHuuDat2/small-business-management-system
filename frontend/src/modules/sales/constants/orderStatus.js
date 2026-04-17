export const ORDER_STATUS = {
  draft: {
    label: "Nháp",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  submitted: {
    label: "Đã gửi",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  sent_to_warehouse: {
    label: "Đã gửi kho",
    className: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  delivered: {
    label: "Đã giao",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
};

export function getOrderStatusMeta(status) {
  return (
    ORDER_STATUS[status] || {
      label: status || "Không rõ",
      className: "bg-slate-100 text-slate-700 border border-slate-200",
    }
  );
}