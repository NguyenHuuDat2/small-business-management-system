import axiosClient from "../api/axiosClient";

const authService = {
  login: async (credentials) => {
    const response = await axiosClient.post("/login", credentials);
    const token = response.data.access_token || response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  },

  register: (userData) => {
    return axiosClient.post("/register", userData);
  },

  logout: async () => {
    try {
      await axiosClient.post("/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  getCurrentUser: () => {
    return axiosClient.get("/user");
  },
};

export default authService;