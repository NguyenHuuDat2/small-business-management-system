import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getUnits
} from "../services/productService";

export default function useProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);

  const loadData = async () => {
    const p = await getProducts();
    const c = await getCategories();
    const u = await getUnits();

    setProducts(p.data || p);
    setCategories(c.data || c);
    setUnits(u.data || u);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async (data) => {
    await createProduct(data);
    loadData();
  };

  const editProduct = async (id, data) => {
    await updateProduct(id, data);
    loadData();
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    loadData();
  };

  return {
    products,
    categories,
    units,
    addProduct,
    editProduct,
    removeProduct,
  };
}