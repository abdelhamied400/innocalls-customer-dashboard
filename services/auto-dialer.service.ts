import { objToQueryString } from "@/lib/utils";
import api from "./api";

type FetchActiveCampaignsResponse = {
  totalPages: number;
  campaigns: {
    createdAt: string;
    name: string;
    durationType: string;
    status: string;
  }[];
};
const fetchActiveCampaigns = async (
  filters?: any
): Promise<FetchActiveCampaignsResponse> => {
  const filtersObj = {
    ...filters,
    isActive: true,
  };

  const queryString = objToQueryString(filtersObj);
  const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
  return res.data.data;
};

const AutoDialerService = {
  fetchActiveCampaigns,
};

export default AutoDialerService;
