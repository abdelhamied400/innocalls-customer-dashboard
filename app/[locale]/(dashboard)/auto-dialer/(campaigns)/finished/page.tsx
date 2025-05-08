import AutoDialerFinishedCampaignsTable from "./table";
import AutoDialerFinishedHead from "./head";

export type Filters = {};
type AutoDialerFinishedCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerFinishedCampaigns = async ({
  searchParams,
}: AutoDialerFinishedCampaignsProps) => {
  return (
    <div className="page" id="auto-dialer">
      <div className="rounded-xl h-full overflow-auto">
        <div className="border rounded-xl">
          <AutoDialerFinishedHead />
          <AutoDialerFinishedCampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AutoDialerFinishedCampaigns;
