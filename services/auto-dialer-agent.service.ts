import { objToQueryString } from "@/lib/utils";
import api from "./api";
import {
  AgentCampaign,
  AgentCampaignCdr,
} from "@/types/autoDialerAgentCampaign";
import { AutoDialerCampaign } from "@/types/autoDialerCampaign";

type FetchAgentCampaignsResponse = {
  totalPages: number;
  totalItems: number;
  campaigns: AgentCampaign[];
};

type FetchAgentCampaignCdrsResponse = {
  totalPages: number;
  totalItems: number;
  callRequests: AgentCampaignCdr[];
};

export default {
  getCampaign: async (campaignId: string): Promise<AutoDialerCampaign> => {
    const res = await api.get(`/auto-dialer-agent/campaigns/${campaignId}`);
    return res.data.data.campaign;
  },
  fetchAgentCampaigns: async (
    filters?: any,
  ): Promise<FetchAgentCampaignsResponse> => {
    const queryString = objToQueryString(filters);
    const res = await api.get(`/auto-dialer-agent/campaigns?${queryString}`);
    return res.data.data;
  },
  fetchAgentCampaignCdrs: async (
    campaignId: string,
    filters?: any,
  ): Promise<FetchAgentCampaignCdrsResponse> => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/auto-dialer-agent/campaigns/${campaignId}/cdrs?${queryString}`,
    );
    return res.data.data;
  },
};
