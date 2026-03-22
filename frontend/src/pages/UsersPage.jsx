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

  console.log("Users data:", users);

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
        loading={loading}
        reloadUsers={fetchData}
        deleteUser={deleteItem}
      />

    </div>

  );

}

export default UsersPage;