import axiosClient from "../../../shared/api/axiosClient";

const dashboardService = {
  getHrDashboard() {
    return axiosClient.get("/hr/dashboard");
  },
};

export default dashboardService;