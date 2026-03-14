import { useEffect, useState } from "react";

export default function useCrud(service) {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {

      const res = await service.getAll();

      setData(res?.data?.data || []);

    } catch (error) {

      console.log("Fetch error:", error);
      setData([]);

    }
  };

  const createItem = async (item) => {
    await service.create(item);
    fetchData();
  };

  const updateItem = async (id, item) => {
    await service.update(id, item);
    fetchData();
  };

  const deleteItem = async (id) => {
    await service.remove(id);
    setData(prev => prev.filter(i => i.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    fetchData,
    createItem,
    updateItem,
    deleteItem
  };

}