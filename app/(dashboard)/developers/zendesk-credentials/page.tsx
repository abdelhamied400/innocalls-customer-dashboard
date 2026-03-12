"use client";

import ZendeskCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const ZendeskCredentialsPage = () => {
  return (
    <div className="page h-full" id="zendesk-credentials">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <ZendeskCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(ZendeskCredentialsPage, "completeControlDeveloperTools"),
);
