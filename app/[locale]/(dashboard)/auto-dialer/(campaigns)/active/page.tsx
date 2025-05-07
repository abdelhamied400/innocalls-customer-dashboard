import { getQueryClient } from "@/lib/getQueryClient";
import AutoDialerActiveCampaignsTable from "./table";
import AutoDialerActiveHead from "./head";
import AutoDialerService from "@/services/auto-dialer.service";

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
  await queryClient.prefetchQuery({
    queryKey: ["auto-dialer-active-campaigns"],
    queryFn: async () => await AutoDialerService.fetchActiveCampaigns({}),
  });

  return (
    <div className="page" id="auto-dialer">
      <div className="rounded-xl h-full overflow-auto">
        <div className="border rounded-xl">
          <AutoDialerActiveHead />
          <AutoDialerActiveCampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default AutoDialerActiveCampaigns;
