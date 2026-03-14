import useCrud from "../hooks/useCrud";
import userService from "../services/userService";
import UserTable from "../components/tables/UserTable";

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
      <div className="p-6 text-center">
        Đang tải dữ liệu...
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