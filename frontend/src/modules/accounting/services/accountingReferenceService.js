import axiosClient from "../../../shared/api/axiosClient";

export const accountingReferenceService = {
  async getCustomers(params = {}) {
    const response = await axiosClient.get("/accounting/reference/customers", {
      params,
    });
    return response.data;
  },

  async getSalesOrders(params = {}) {
    const response = await axiosClient.get("/accounting/reference/sales-orders", {
      params,
    });
    return response.data;
  },

  async getInvoices(params = {}) {
    const response = await axiosClient.get("/accounting/reference/invoices", {
      params,
    });
    return response.data;
  },
};
