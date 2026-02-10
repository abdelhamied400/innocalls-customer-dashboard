"use client";

import TimelineTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const Timeline = () => {
  return (
    <div className="page h-full" id="timeline">
      <TimelineTable />
    </div>
  );
};

export default withActiveOrganization(Timeline);
