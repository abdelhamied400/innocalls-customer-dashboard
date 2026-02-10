"use client";

import UsersTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

type UsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
  }>;
};
const Users = ({ searchParams }: UsersProps) => {
  return (
    <div className="page h-full" id="users">
      <UsersTable />
    </div>
  );
};

export default withActiveOrganization(Users);
