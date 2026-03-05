"use client";

import CallReportingTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const CallReporting = () => {
  return (
    <div className="page h-full" id="call-reporting">
      <CallReportingTable />
    </div>
  );
};

export default withActiveOrganization(CallReporting);
