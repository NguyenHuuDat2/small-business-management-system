import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useCrud(service) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await service.getAll();

      console.log("API RESPONSE:", res?.data);

      setData(res?.data?.data || []);

    } catch (err) {

      console.log("Fetch error:", err);

      setError(err);
      setData([]);

      toast.error("Không tải được dữ liệu từ server");

    } finally {

      setLoading(false);

    }

  };

  const createItem = async (item) => {

    try {

      await service.create(item);

      toast.success("Thêm thành công");

      fetchData();

    } catch (err) {

      console.log("Create error:", err);

      toast.error("Thêm thất bại");

    }

  };

  const updateItem = async (id, item) => {

    try {

      await service.update(id, item);

      toast.success("Cập nhật thành công");

      fetchData();

    } catch (err) {

      console.log("Update error:", err);

      toast.error("Cập nhật thất bại");

    }

  };

  const deleteItem = async (id) => {

    try {

      await service.remove(id);

      toast.success("Xoá thành công");

      setData(prev => prev.filter(i => i.id !== id));

    } catch (err) {

      console.log("Delete error:", err);

      toast.error("Xoá thất bại");

    }

  };

  useEffect(() => {

    fetchData();

  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem
  };

}