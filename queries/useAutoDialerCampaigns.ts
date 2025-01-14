import AutoDialerService from "@/services/auto-dialer.service";

type ActiveAutoDialerCampaignsFilters = {
  userId?: string;
};
const queryActiveAutoDialerCampaigns = (
  filters: ActiveAutoDialerCampaignsFilters
) => {
  return {
    queryKey: ["auto-dialer-active-campaigns", filters],
    queryFn: async () => await AutoDialerService.fetchActiveCampaigns(filters),
  };
};

export default queryActiveAutoDialerCampaigns;
