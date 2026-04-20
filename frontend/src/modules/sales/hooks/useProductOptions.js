import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";

export function useProductOptions() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/sales/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    refreshProducts: fetchProducts
  };
}