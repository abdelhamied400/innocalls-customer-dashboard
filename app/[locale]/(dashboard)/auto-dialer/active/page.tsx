import { getQueryClient } from "@/lib/getQueryClient";
import AutoDialerActiveCampaignsTable from "./table";
import queryActiveAutoDialerCampaigns from "@/queries/useAutoDialerCampaigns";

export type Filters = {
  userId: string;
};
type AutoDialerActiveCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerActiveCampaigns = async ({
  searchParams,
}: AutoDialerActiveCampaignsProps) => {
  const queryClient = getQueryClient();
  const query = await searchParams;
  await queryClient.prefetchQuery(queryActiveAutoDialerCampaigns(query));

  return (
    <div className="page" id="auto-dialer">
      <div className="rounded-xl h-full overflow-auto">
        <div className="border rounded-xl">
          <AutoDialerActiveCampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AutoDialerActiveCampaigns;
