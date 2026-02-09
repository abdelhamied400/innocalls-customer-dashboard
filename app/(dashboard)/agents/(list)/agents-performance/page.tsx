"use client";

import AgentsPerformanceTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const AgentsPerformance = () => {
  return (
    <div className="page h-full" id="agents-performance">
      <AgentsPerformanceTable />
    </div>
  );
};

export default withActiveOrganization(AgentsPerformance);
