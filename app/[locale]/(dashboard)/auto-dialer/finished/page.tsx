import { getQueryClient } from "@/lib/getQueryClient";
import AutoDialerActiveTable from "./table";
import { fetchAllAutoDialerCampaigns } from "@/services/auto-dialer.service";

export type Filters = {
  userId: string;
};
type ActiveAutoDialerCampaignsProps = {
  searchParams: Promise<Filters>;
};
const ActiveAutoDialerCampaigns = async ({
  searchParams,
}: ActiveAutoDialerCampaignsProps) => {
  const queryClient = getQueryClient();
  const query = await searchParams;
  queryClient.prefetchQuery({
    queryKey: ["autoDialerActiveCampaigns", query],
    queryFn: () => fetchAllAutoDialerCampaigns(),
  });

  return (
    <div className="page" id="auto-dialer">
      <div className="bg-white rounded-xl h-full overflow-auto">
        <div className="bg-white border rounded-xl">
          <AutoDialerActiveTable />
        </div>
      </div>
    </div>
  );
};

export default ActiveAutoDialerCampaigns;
