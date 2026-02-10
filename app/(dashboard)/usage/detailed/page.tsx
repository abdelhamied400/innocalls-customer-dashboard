"use client";

import UsageDetailedTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const UsageDetailed = () => {
  return (
    <div className="page h-full" id="usage-detailed">
      <UsageDetailedTable />
    </div>
  );
};

export default withActiveOrganization(UsageDetailed);
