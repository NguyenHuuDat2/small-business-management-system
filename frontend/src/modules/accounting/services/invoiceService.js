import axiosClient from "../../../shared/api/axiosClient";

const invoiceService = {
  // 1. Lấy danh sách hóa đơn (có hỗ trợ filter status, search, phân trang)
  list(params = {}) {
    return axiosClient.get("/accounting/invoices", { params });
  },

  // 2. Lấy chi tiết một hóa đơn (Dùng để render trang in hoặc xem chi tiết)
  detail(id) {
    return axiosClient.get(`/accounting/invoices/${id}`);
  },

  // 3. Tạo hóa đơn mới (Lập hóa đơn)
  create(payload) {
    return axiosClient.post("/accounting/invoices", payload);
  },

  // 4. Cập nhật thông tin hóa đơn (Nếu cần)
  update(id, payload) {
    return axiosClient.put(`/accounting/invoices/${id}`, payload);
  },

  // 5. Xóa hóa đơn
  remove(id) {
    return axiosClient.delete(`/accounting/invoices/${id}`);
  },

  // 6. Cập nhật trạng thái (Dùng cho nút Xác nhận thanh toán / Hủy hóa đơn)
  // Route này tương ứng với hàm updateStatus mình viết trong Controller lúc nãy
  updateStatus(id, status) {
    return axiosClient.patch(`/accounting/invoices/${id}/status`, { status });
  }
};

export default invoiceService;