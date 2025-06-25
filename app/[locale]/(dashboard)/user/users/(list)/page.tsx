import { parseTableInitialParams } from "@/lib/queryParams";
import UsersTable from "./table";
import usersService from "@/services/users.service";

type UsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
};
const Users = async ({ searchParams }: UsersProps) => {
  const { page, pageSize, filters, sorting } = await parseTableInitialParams(
    searchParams
  );
  const users = await usersService.getUsers();

  return (
    <div className="page h-full" id="users">
      <UsersTable
        initialData={users}
        initialPagination={{
          pageIndex: Number(page) - 1,
          pageSize: Number(pageSize),
        }}
        initialFilters={filters}
        initialSorting={sorting}
      />
    </div>
  );
};

export default Users;
