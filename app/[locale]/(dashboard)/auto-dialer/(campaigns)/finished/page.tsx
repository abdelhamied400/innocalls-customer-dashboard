import AutoDialerFinishedCampaignsTable from "./table";

export type Filters = {};
type AutoDialerFinishedCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerFinishedCampaigns = async ({
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

export default AutoDialerFinishedCampaigns;
