import axios from "axios";

const axiosClient = axios.create({
  // Tự động lấy URL tùy theo môi trường
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;