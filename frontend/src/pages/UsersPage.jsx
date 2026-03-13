import useCrud from "../hooks/useCrud";
import userService from "../services/userService";
import UserTable from "../components/tables/UserTable";

function UsersPage() {

  const {
    data: users,
    fetchData,
    deleteItem
  } = useCrud(userService);

  return (

    <div>

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