import axiosClient from "../../../shared/api/axiosClient";

const invoiceService = {
  list(params = {}) {
    return axiosClient.get("/accounting/invoices", { params });
  },

  detail(id) {
    return axiosClient.get(`/accounting/invoices/${id}`);
  },

  create(payload) {
    return axiosClient.post("/accounting/invoices", payload);
  },

  update(id, payload) {
    return axiosClient.put(`/accounting/invoices/${id}`, payload);
  },

  remove(id) {
    return axiosClient.delete(`/accounting/invoices/${id}`);
  },

  updateStatus(id, status) {
    return axiosClient.patch(`/accounting/invoices/${id}/status`, { status });
  },

  listReceivables(params = {}) {
    return axiosClient.get("/accounting/receivables", { params });
  },

  listPayments(params = {}) {
    return axiosClient.get("/accounting/payments", { params });
  },
};

export default invoiceService;
