import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://small-business-management-system.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;