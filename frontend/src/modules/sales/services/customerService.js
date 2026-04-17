import axiosClient from "../../../shared/api/axiosClient";

export const customerService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/sales/customers", { params });
    return response.data;
  },

  async create(payload) {
    const response = await axiosClient.post("/sales/customers", payload);
    return response.data;
  },

  async update(id, payload) {
    const response = await axiosClient.put(`/sales/customers/${id}`, payload);
    return response.data;
  },
};