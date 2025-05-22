import Link from "next/link";
import MonitorUsersTable from "./table";
import { Button } from "@/components/ui/button";

const MonitorUsers = () => {
  return (
    <div className="page" id="users">
      <div className="bg-white rounded-xl p-4">
        <div className="tabs mb-4 flex gap-2 items-center">
          <Link href="/users">
            <Button variant="tab">Users List</Button>
          </Link>
          <Button variant="tab" data-active>
            Monitor Users
          </Button>
        </div>

        <MonitorUsersTable />
      </div>
    </div>
  );
};

export default MonitorUsers;
