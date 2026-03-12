"use client";

import WebrtcCredentialsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

const WebrtcCredentialsPage = () => {
  return (
    <div className="page h-full" id="webrtc-credentials">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <WebrtcCredentialsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(WebrtcCredentialsPage, "completeControlDeveloperTools"),
);
