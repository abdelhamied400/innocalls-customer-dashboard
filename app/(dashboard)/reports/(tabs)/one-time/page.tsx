"use client";

import OneTimeReportTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const OneTimeReportPage = () => {
  return (
    <div className="page h-full overflow-hidden" id="one-time-report">
      <OneTimeReportTable />
    </div>
  );
};

export default withActiveOrganization(OneTimeReportPage);
