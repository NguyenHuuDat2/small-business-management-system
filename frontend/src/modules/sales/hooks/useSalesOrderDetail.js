import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";

export function useSalesOrderDetail(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    if (!orderId) return;

    try {
      setLoading(true);

      const res = await axiosClient.get(`/sales/orders/${orderId}`);
      setOrder(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [orderId]);

  const total = order?.items?.reduce(
    (sum, item) => sum + item.subtotal,
    0
  ) || 0;

  return {
    order,
    loading,
    total,
    refresh: fetchDetail
  };
}