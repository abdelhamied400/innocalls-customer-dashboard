import UsersTable from "./table";

type UsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
};
const Users = async ({ searchParams }: UsersProps) => {
  return (
    <div className="page h-full" id="users">
      <UsersTable />
    </div>
  );
};

export default Users;
