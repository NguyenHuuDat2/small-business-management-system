import axiosClient from "../../../shared/api/axiosClient";

export const accountingDashboardService = {
  async getStats() {
    const response = await axiosClient.get("/accounting/dashboard/stats");
    return response.data;
  },
};
