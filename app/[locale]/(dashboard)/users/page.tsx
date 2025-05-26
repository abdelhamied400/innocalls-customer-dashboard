import usersService from "@/services/users.service";
import UsersTable from "./table";

type UsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
};
const Users = async ({ searchParams }: UsersProps) => {
  const { page = "1", pageSize = "10", ...filters } = await searchParams;
  const users = await usersService.getUsers();

  return (
    <div className="page h-full" id="users">
      <UsersTable data={users} />
    </div>
  );
};

export default Users;
