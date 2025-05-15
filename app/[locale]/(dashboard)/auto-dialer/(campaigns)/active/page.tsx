import AutoDialerActiveCampaignsTable from "./table";
import AutoDialerActiveHead from "./head";

export type Filters = {};
type AutoDialerActiveCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerActiveCampaigns = async ({
  searchParams,
}: AutoDialerActiveCampaignsProps) => {
  return (
    <div className="page" id="auto-dialer">
      <div className="rounded-xl">
        <div className="border rounded-xl">
          <AutoDialerActiveHead />
          <AutoDialerActiveCampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AutoDialerActiveCampaigns;
