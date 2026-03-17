"use client";

import ZohoCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const ZohoCredentialsPage = () => {
  return (
    <div className="page h-full" id="zoho-credentials">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <ZohoCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(ZohoCredentialsPage, "completeControlDeveloperTools"),
);
