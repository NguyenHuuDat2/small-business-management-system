import axiosClient from "../api/axiosClient";

export default {

  getAll() {
    return axiosClient.get("/users");
  },

  get(id) {
    return axiosClient.get(`/users/${id}`);
  },

  create(data) {
    return axiosClient.post("/users", data);
  },

  update(id, data) {
    return axiosClient.put(`/users/${id}`, data);
  },

  remove(id) {
    return axiosClient.delete(`/users/${id}`);
  }

};