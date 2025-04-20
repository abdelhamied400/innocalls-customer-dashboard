import { getQueryClient } from "@/lib/getQueryClient";
import AutoDialerFinishedCampaignsTable from "./table";
import queryFinishedAutoDialerCampaigns from "@/queries/useAutoDialerCampaigns";
import AutoDialerFinishedHead from "./head";

export type Filters = {
  userId: string;
};
type AutoDialerFinishedCampaignsProps = {
  searchParams: Promise<Filters>;
};
const AutoDialerFinishedCampaigns = async ({
  searchParams,
}: AutoDialerFinishedCampaignsProps) => {
  const queryClient = getQueryClient();
  const query = await searchParams;
  await queryClient.prefetchQuery(queryFinishedAutoDialerCampaigns(query));

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
