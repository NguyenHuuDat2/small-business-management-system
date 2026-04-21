import axiosClient from "../../../shared/api/axiosClient";

export const receivableService = {
  async getList(params = {}) {
    const response = await axiosClient.get("/accounting/receivables", { params });
    return response.data;
  },
};
