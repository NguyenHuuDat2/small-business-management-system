import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://small-business-management-system.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;