import axiosClient from "../../../shared/api/axiosClient";

export const salesOrderService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/sales/orders", { params });
    return response.data;
  },

  async getDetail(id) {
    const response = await axiosClient.get(`/sales/orders/${id}`);
    return response.data;
  },

  async create(payload) {
    const response = await axiosClient.post("/sales/orders", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await axiosClient.put(`/sales/orders/${id}`, payload);
    return response.data;
  },

  async submit(id) {
    const response = await axiosClient.post(`/sales/orders/${id}/submit`);
    return response.data;
  },

  async approve(id) {
    const response = await axiosClient.post(`/sales/orders/${id}/approve`);
    return response.data;
  },

  async reject(id) {
    const response = await axiosClient.post(`/sales/orders/${id}/reject`);
    return response.data;
  },

  async cancel(id) {
    const response = await axiosClient.post(`/sales/orders/${id}/cancel`);
    return response.data;
  },
};