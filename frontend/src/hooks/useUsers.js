import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

export default function useUsers() {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {

      const res = await getUsers();
      setUsers(res.data.data);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    fetchUsers
  };
}