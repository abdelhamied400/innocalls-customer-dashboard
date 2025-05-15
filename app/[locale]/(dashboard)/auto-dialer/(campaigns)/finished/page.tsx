import AutoDialerFinshedCampaignsTable from "./table";
import AutoDialerFinshedHead from "./head";

export type Filters = {};
type AutoDialerFinshedCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerFinshedCampaigns = async ({
  searchParams,
}: AutoDialerFinshedCampaignsProps) => {
  return (
    <div className="page" id="auto-dialer">
      <div className="rounded-xl">
        <div className="border rounded-xl">
          <AutoDialerFinshedHead />
          <AutoDialerFinshedCampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AutoDialerFinshedCampaigns;
