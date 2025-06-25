import MonitorUsersTable from "./table";

type MonitorUsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
    filters: string;
    sorting: string;
  }>;
};
const MonitorUsers = async ({ searchParams }: MonitorUsersProps) => {
  return (
    <div className="page h-full" id="users">
      <MonitorUsersTable />
    </div>
  );
};

export default MonitorUsers;
