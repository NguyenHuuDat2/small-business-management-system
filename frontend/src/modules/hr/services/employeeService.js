import axiosClient from "../../../shared/api/axiosClient";

const employeeService = {
  list(params = {}) {
    return axiosClient.get("/hr/employees", { params });
  },

  detail(id) {
    return axiosClient.get(`/hr/employees/${id}`);
  },

  create(payload) {
    return axiosClient.post("/hr/employees", payload);
  },

  update(id, payload) {
    return axiosClient.put(`/hr/employees/${id}`, payload);
  },

  remove(id) {
    return axiosClient.delete(`/hr/employees/${id}`);
  },

  departmentOptions() {
    return axiosClient.get("/hr/department-options");
  },
};

export default employeeService;