const PAYMENT_METHODS = ["Chuyen khoan", "Tien mat", "Vi dien tu"];

export function toNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(toNumber(value));
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

export function normalizeInvoiceStatus(status) {
  if (status === "Paid" || status === "Cancelled" || status === "Pending") {
    return status;
  }
  return "Pending";
}

export function getInvoiceStatusMeta(status) {
  const normalized = normalizeInvoiceStatus(status);

  if (normalized === "Paid") {
    return {
      code: "Paid",
      label: "Da thanh toan",
      className: "bg-emerald-100 text-emerald-700",
    };
  }

  if (normalized === "Cancelled") {
    return {
      code: "Cancelled",
      label: "Da huy",
      className: "bg-rose-100 text-rose-700",
    };
  }

  return {
    code: "Pending",
    label: "Cho thanh toan",
    className: "bg-amber-100 text-amber-700",
  };
}

export function addDays(value, days = 0) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + days);
  return date;
}

export function estimateDueDate(createdAt, dueInDays = 7) {
  return addDays(createdAt, dueInDays);
}

export function calcOverdueDays(dueDate, today = new Date()) {
  if (!dueDate) return 0;
  const target = new Date(dueDate);
  const current = new Date(today);
  target.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  const diff = current.getTime() - target.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getAgingBucket(overdueDays) {
  if (overdueDays <= 0) return "current";
  if (overdueDays <= 7) return "1_7";
  if (overdueDays <= 30) return "8_30";
  return "31_plus";
}

export function getReceivablePriority(overdueDays, amount) {
  if (overdueDays > 30 || toNumber(amount) >= 50000000) return "high";
  if (overdueDays > 7 || toNumber(amount) >= 15000000) return "medium";
  return "normal";
}

export function pickPaymentMethod(invoiceId) {
  const index = Number(invoiceId || 0) % PAYMENT_METHODS.length;
  return PAYMENT_METHODS[index];
}
