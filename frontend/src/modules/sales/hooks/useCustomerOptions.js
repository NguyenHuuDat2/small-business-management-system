import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";

export function useCustomerOptions() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const res = await axiosClient.get("/sales/reference/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    refreshCustomers: fetchCustomers
  };
}