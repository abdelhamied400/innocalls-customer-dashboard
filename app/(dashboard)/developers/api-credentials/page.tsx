"use client";

import ApiCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const ApiCredentialsPage = () => {
  return (
    <div className="page h-full" id="api-credentials">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <ApiCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(ApiCredentialsPage, "completeControlDeveloperTools"),
);
