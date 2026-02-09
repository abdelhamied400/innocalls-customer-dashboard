"use client";

import UsageSummaryTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const UsageSummary = () => {
  return (
    <div className="page h-full" id="charges">
      <UsageSummaryTable />
    </div>
  );
};

export default withActiveOrganization(UsageSummary);
