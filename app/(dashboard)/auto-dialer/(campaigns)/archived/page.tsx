"use client";

import AutoDialerFinishedCampaignsTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";

export type Filters = {};
type AutoDialerFinishedCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerFinishedCampaigns = ({
  searchParams,
}: AutoDialerFinishedCampaignsProps) => {
  return (
    <div className="page flex-1 overflow-hidden" id="auto-dialer">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <AutoDialerFinishedCampaignsTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(withPermission(AutoDialerFinishedCampaigns, "fullAccessAutoDialerCampaigns"));
