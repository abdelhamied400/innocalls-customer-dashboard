import { objToQueryString } from "@/lib/utils";
import api from "./api";
import { objToFormData } from "@/lib/formData";

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
      state: "active",
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
    return res.data.data;
  },
  fetchFinishedCampaigns: async (
    filters?: any
  ): Promise<FetchActiveCampaignsResponse> => {
    const filtersObj = {
      ...filters,
      isActive: false,
      state: "finished",
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
    return res.data.data;
  },
  fetchArchivedCampaigns: async (
    filters?: any
  ): Promise<FetchActiveCampaignsResponse> => {
    const filtersObj = {
      ...filters,
      isActive: false,
      state: "archived",
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(`/auto-dialer/campaigns?${queryString}`);
    return res.data.data;
  },
  getCampaign: async (campaignId: string) => {
    const res = await api.get(`/auto-dialer/campaigns/${campaignId}`);
    return res.data.data.campaign;
  },
  createCampaign: async (data: object) => {
    const formData = objToFormData(data);
    const res = await api.post("auto-dialer/campaigns", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data.campaign;
  },
  updateCampaign: async (campaignId: string, data: object) => {
    const formData = objToFormData(data);
    const res = await api.put(`auto-dialer/campaigns/${campaignId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
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
  archiveCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/archive`);
    return res.data;
  },
  downloadTemplate: async () => {
    const res = await api.get(`/auto-dialer/campaigns/template`, {
      responseType: "blob", // important
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "template.csv"; // filename
    a.click();

    window.URL.revokeObjectURL(url);
    return res.data;
  },
};
