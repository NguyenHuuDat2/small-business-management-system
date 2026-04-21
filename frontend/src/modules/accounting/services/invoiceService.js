import axiosClient from "../../../shared/api/axiosClient";

export const invoiceService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/accounting/invoices", { params });
    return response.data;
  },

  async create(payload) {
    const response = await axiosClient.post("/accounting/invoices", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await axiosClient.put(`/accounting/invoices/${id}`, payload);
    return response.data;
  },

  async remove(id) {
    const response = await axiosClient.delete(`/accounting/invoices/${id}`);
    return response.data;
  },
};
