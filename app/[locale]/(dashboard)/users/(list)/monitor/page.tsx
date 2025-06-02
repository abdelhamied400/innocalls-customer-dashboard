import usersService from "@/services/users.service";
import MonitorUsersTable from "./table";
import { parseTableInitialParams } from "@/lib/queryParams";

type MonitorUsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
    filters: string;
    sorting: string;
  }>;
};
const MonitorUsers = async ({ searchParams }: MonitorUsersProps) => {
  const { page, pageSize, filters, sorting } = await parseTableInitialParams(
    searchParams
  );
  const users = await usersService.getUsersMonitor();

  return (
    <div className="page h-full" id="users">
      <MonitorUsersTable
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

export default MonitorUsers;
