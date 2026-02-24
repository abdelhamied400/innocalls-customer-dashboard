import { objToQueryString } from "@/lib/utils";
import api from "./api";
import { objToFormData } from "@/lib/formData";
import {
  AutoDialerCampaign,
  CampaignCdr,
  CampaignMetrics,
  CorruptedRow,
  InitiatedCall,
  UncompletedRequest,
} from "@/types/autoDialerCampaign";

type FetchActiveCampaignsResponse = {
  totalPages: number;
  totalItems: number;
  campaigns: AutoDialerCampaign[];
};

type FetchCampaignCdrsResponse = {
  totalPages: number;
  totalItems: number;
  callRequests: CampaignCdr[];
};

type FetchCorruptedRowsResponse = {
  totalPages: number;
  totalItems: number;
  corruptedRows: CorruptedRow[];
};

type FetchUncompletedRequestsResponse = {
  totalPages: number;
  totalItems: number;
  requests: UncompletedRequest[];
};

export default {
  fetchActiveCampaigns: async (
    filters?: any,
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
    filters?: any,
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
    filters?: any,
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
  getCampaign: async (campaignId: string): Promise<AutoDialerCampaign> => {
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
  updateCampaignCustomersFile: async (campaignId: string, data: object) => {
    const formData = objToFormData(data);
    const res = await api.post(
      `auto-dialer/campaigns/${campaignId}/file`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
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
  fetchCampaignCdrs: async (
    campaignId: string,
    filters?: any,
  ): Promise<FetchCampaignCdrsResponse> => {
    const filtersObj = {
      ...filters,
      campaignId,
    };

    const queryString = objToQueryString(filtersObj);
    const res = await api.get(
      `/auto-dialer/campaigns/${campaignId}/cdrs?${queryString}`,
    );
    return res.data.data;
  },
  fetchCampaignMetrics: async (
    campaignId: string,
  ): Promise<CampaignMetrics> => {
    const res = await api.get(`/auto-dialer/campaigns/${campaignId}/metrics`);
    return res.data;
  },
  fetchCorruptedRows: async (
    campaignId: string,
    filters?: any,
  ): Promise<FetchCorruptedRowsResponse> => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/auto-dialer/campaigns/${campaignId}/corrupted-rows?${queryString}`,
    );
    return res.data;
  },
  updateCorruptedRow: async (
    campaignId: string,
    rowId: string,
    data: { name: string; phone: string; information: string },
  ) => {
    const res = await api.put(
      `/auto-dialer/campaigns/${campaignId}/corrupted-rows/${rowId}/fix`,
      data,
    );
    return res.data;
  },
  ignoreCorrupted: async (campaignId: string) => {
    const res = await api.patch(
      `/auto-dialer/campaigns/${campaignId}/ignore-corrupted`,
    );
    return res.data;
  },
  cancelCampaign: async (campaignId: string) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}/cancel`);
    return res.data;
  },
  fetchUncompletedRequests: async (
    campaignId: string,
    filters?: any,
  ): Promise<FetchUncompletedRequestsResponse> => {
    const queryString = objToQueryString(filters);
    const res = await api.get(
      `/auto-dialer/campaigns/${campaignId}/uncompleted-requests?${queryString}`,
    );
    return res.data.data;
  },
  fetchCurrentInitiatedCalls: async (
    campaignId: string,
  ): Promise<InitiatedCall[]> => {
    const res = await api.get(
      `/auto-dialer/campaigns/${campaignId}/current-initiated-calls`,
    );
    return res.data.data.calls;
  },
  exportUncompletedRequests: async (campaignId: string) => {
    const res = await api.get(
      `/auto-dialer/campaigns/${campaignId}/uncompleted-requests/export`,
    );
    return res.data;
  },
  updateCampaignMainInfo: async (
    campaignId: string,
    data: {
      name: string;
      agents: number[];
      callers: { destination: string; callerNumber: string }[];
    },
  ) => {
    const res = await api.patch(`/auto-dialer/campaigns/${campaignId}`, data);
    return res.data;
  },
};
