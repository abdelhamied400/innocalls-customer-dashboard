"use client";

import FreshdeskCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const FreshdeskCredentialsPage = () => {
  return (
    <div className="page h-full" id="freshdesk-credentials">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <FreshdeskCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(FreshdeskCredentialsPage, "completeControlDeveloperTools"),
);
