import axiosClient from "../../../shared/api/axiosClient";

const authService = {
  login(payload) {
    return axiosClient.post("/auth/login", payload);
  },
  me() {
    return axiosClient.get("/auth/me");
  },
  logout() {
    return axiosClient.post("/auth/logout");
  },
};

export default authService;