"use client";

import TicketsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const InnoSupport = () => {
  return (
    <div className="page h-full" id="innosupport">
      <TicketsTable />
    </div>
  );
};

export default withActiveOrganization(InnoSupport);
