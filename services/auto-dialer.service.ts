import { objToQueryString } from "@/lib/utils";
import api from "./api";

type FetchActiveCampaignsResponse = {
  totalPages: number;
  totalItems: number;
  campaigns: {
    createdAt: string;
    name: string;
    durationType: string;
    status: string;
  }[];
};

export default {
  fetchActiveCampaigns: async (
    filters?: any
  ): Promise<FetchActiveCampaignsResponse> => {
    const filtersObj = {
      ...filters,
      isActive: true,
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
    return {
      ...res.data.data,
      campaigns: Array(20).fill(res.data.data.campaigns[0]),
    };
  },
  fetchFinshedCampaigns: async (
    filters?: any
  ): Promise<FetchActiveCampaignsResponse> => {
    const filtersObj = {
      ...filters,
      isActive: false,
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
    return res.data.data;
  },
  startCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/start`);
    return res.data;
  },
  resumeCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/resume`);
    return res.data;
  },
  pauseCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/pause`);
    return res.data;
  },
  finishCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/finish`);
    return res.data;
  },
  downloadReport: async (campaignId: string) => {
    const res = await api.get(`auto-dialer/campaigns/${campaignId}/stats`);
    return res.data;
  },
};
