import { getQueryClient } from "@/lib/getQueryClient";
import AutoDialerFinishedCampaignsTable from "./table";
import AutoDialerFinishedHead from "./head";
import AutoDialerService from "@/services/auto-dialer.service";

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
  await queryClient.prefetchQuery({
    queryKey: ["auto-dialer-finished-campaigns"],
    queryFn: async () => await AutoDialerService.fetchActiveCampaigns({}),
  });

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
