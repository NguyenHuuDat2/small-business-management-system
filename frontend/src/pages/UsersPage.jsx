import useCrud from "../hooks/useCrud";
import userService from "../services/userService";
import UserTable from "../components/tables/UserTable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UsersPage() {

  const {
    data: users,
    loading,
    error,
    fetchData,
    deleteItem
  } = useCrud(userService);

  // DEBUG
  console.log("Users data:", users);

  // LOADING STATE
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">

        <Skeleton height={30} width={200} className="mb-6" />

        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={40} className="mb-3" />
        ))}

      </div>
    );
  }


  // ERROR STATE
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Không thể tải dữ liệu từ server
      </div>
    );
  }

  return (

    <div className="p-6">

      <h2 className="text-xl font-bold mb-4">
        Danh sách nhân viên
      </h2>

      <UserTable
        users={users}
        reloadUsers={fetchData}
        deleteUser={deleteItem}
      />

    </div>

  );

}

export default UsersPage;