"use client";

import ScheduledReportTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const ScheduledReportPage = () => {
  return (
    <div className="page h-full overflow-hidden" id="scheduled-report">
      <ScheduledReportTable />
    </div>
  );
};

export default withActiveOrganization(ScheduledReportPage);
