import axiosClient from "../../../shared/api/axiosClient";

export const salesDashboardService = {
  async getStats() {
    const response = await axiosClient.get("/sales/dashboard/stats");
    return response.data;
  },
};