"use client";

import MonitorUsersTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

type MonitorUsersProps = {
  searchParams: Promise<{
    page: string;
    pageSize: string;
    filters: string;
    sorting: string;
  }>;
};
const MonitorUsers = ({ searchParams }: MonitorUsersProps) => {
  return (
    <div className="page h-full" id="users">
      <MonitorUsersTable />
    </div>
  );
};

export default withActiveOrganization(MonitorUsers);
