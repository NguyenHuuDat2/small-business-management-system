import axiosClient from "../../../shared/api/axiosClient";

export const productService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/sales/products", { params });
    return response.data;
  },
};