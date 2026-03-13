import useUsers from "../hooks/useUsers";
import UserTable from "../components/tables/UserTable";

function UsersPage() {

  const { users, fetchUsers } = useUsers();

  return (

    <div>

      <h2 className="text-xl font-bold mb-4">
        Danh sách nhân viên
      </h2>

      <UserTable
        users={users}
        reloadUsers={fetchUsers}
      />

    </div>

  );
}

export default UsersPage;