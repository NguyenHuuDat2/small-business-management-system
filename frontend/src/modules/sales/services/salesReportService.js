import axiosClient from "../../../shared/api/axiosClient";

export const salesReportService = {
  async getOverview(params = {}) {
    const response = await axiosClient.get("/sales/reports/overview", {
      params,
    });
    return response.data;
  },
};