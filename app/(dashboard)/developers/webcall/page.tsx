"use client";

import WebCallTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const WebCallPage = () => {
  return (
    <div className="page h-full" id="webcall">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <WebCallTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(WebCallPage, "completeControlDeveloperTools"),
);
