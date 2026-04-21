import axiosClient from "../../../shared/api/axiosClient";

export const paymentService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/accounting/payments", { params });
    return response.data;
  },

  async create(payload) {
    const response = await axiosClient.post("/accounting/payments", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await axiosClient.put(`/accounting/payments/${id}`, payload);
    return response.data;
  },

  async remove(id) {
    const response = await axiosClient.delete(`/accounting/payments/${id}`);
    return response.data;
  },
};
