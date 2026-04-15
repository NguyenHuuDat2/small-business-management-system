import axios from "axios";

const ACCESS_TOKEN_KEY = "access_token";
const AUTH_USER_KEY = "auth_user";
const AUTH_SIDEBAR_KEY = "auth_sidebar";
const AUTH_PERMISSIONS_KEY = "auth_permissions";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://small-business-management-system.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API error:",
      error.config?.url,
      error.response?.status,
      error.response?.data
    );

    // Tạm thời chưa auto clear auth ở đây
    // để tránh app tự mất trạng thái đăng nhập khi có 1 request 401

    return Promise.reject(error);
  }
);

export default axiosClient;