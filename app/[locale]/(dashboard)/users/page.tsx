import usersService from "@/services/users.service";
import UsersTable from "./table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";

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
    <div className="page" id="users">
      <div className="bg-white rounded-xl p-4">
        <div className="tabs mb-4">
          <Button variant="tab" data-active>
            Users List
          </Button>
          <Button variant="tab">Monitor Users</Button>
        </div>

        <UsersTable
          data={users}
          columns={columns}
          initialPagination={{
            pageIndex: Number(page) - 1,
            pageSize: Number(pageSize),
          }}
          initialFilters={Object.entries(filters).map(([key, value]) => ({
            id: key,
            value: value,
          }))}
        />
      </div>
    </div>
  );
};

export default Users;
