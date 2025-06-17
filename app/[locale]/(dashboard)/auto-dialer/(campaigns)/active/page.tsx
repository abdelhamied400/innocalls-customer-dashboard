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
    <div className="page flex-1 overflow-hidden" id="auto-dialer">
      <div className="border rounded-xl h-full flex flex-col overflow-hidden">
        <AutoDialerActiveCampaignsTable />
      </div>
    </div>
  );
};

export default AutoDialerActiveCampaigns;
