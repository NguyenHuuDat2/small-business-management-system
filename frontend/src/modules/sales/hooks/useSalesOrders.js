import { useCallback, useEffect, useRef, useState } from "react";
import { salesOrderService } from "../services/salesOrderService";

export function useSalesOrders(params) {
  const [data, setData] = useState({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const lastParamsRef = useRef(params);

  const fetchOrders = useCallback(async (nextParams = params) => {
    setLoading(true);
    setError("");

    try {
      const response = await salesOrderService.getList(nextParams);
      setData(response?.data || {});
      lastParamsRef.current = nextParams;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders(params);
  }, [fetchOrders, params]);

  const refresh = useCallback(() => {
    fetchOrders(lastParamsRef.current);
  }, [fetchOrders]);

  return {
    orders: data?.data || [],
    pagination: {
      current_page: data?.current_page || 1,
      last_page: data?.last_page || 1,
      per_page: data?.per_page || 10,
      total: data?.total || 0,
    },
    loading,
    error,
    refresh,
  };
}