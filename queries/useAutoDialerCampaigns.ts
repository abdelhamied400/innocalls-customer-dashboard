import { useFilters } from "@/providers/AutoDialerFilterProvider";
import { fetchAllAutoDialerCampaigns } from "@/services/auto-dialer.service";
import { useQuery } from "@tanstack/react-query";

const useAutoDialerCampaigns = () => {
  const { filters } = useFilters();

  const { data, isLoading } = useQuery({
    queryKey: ["autoDialerActiveCampaigns", filters],
    queryFn: () => fetchAllAutoDialerCampaigns(filters),
  });

  return { data, isLoading };
};

export default useAutoDialerCampaigns;
