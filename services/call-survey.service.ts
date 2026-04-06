import api from "./api";
import {
  CallSurvey,
  CallSurveyCdr,
  CallSurveyDetail,
} from "@/types/callSurvey";
import { objToQueryString } from "@/lib/utils";

type FetchCdrsResponse = {
  callRequests: CallSurveyCdr[];
  totalItems: number;
  totalPages: number;
};

type UncompletedRequest = {
  id: string;
  name: string;
  phone: string;
  remainingTrials: number;
};

type FetchUncompletedResponse = {
  requests: UncompletedRequest[];
  totalItems: number;
  totalPages: number;
};

type FetchSurveysResponse = {
  surveys: CallSurvey[];
  totalItems: number;
  totalPages: number;
};

export default {
  fetchSurveys: async (filters?: any): Promise<FetchSurveysResponse> => {
    const queryString = objToQueryString(filters || {});
    const res = await api.get(`/surveys?${queryString}`);
    return res.data.data;
  },

  getSurvey: async (id: string): Promise<CallSurveyDetail> => {
    const res = await api.get(`/surveys/${id}`);
    return res.data.data.survey;
  },

  startSurvey: async (id: string) => {
    const res = await api.patch(`/surveys/${id}/start`);
    return res.data.data;
  },

  pauseSurvey: async (id: string) => {
    const res = await api.patch(`/surveys/${id}/pause`);
    return res.data.data;
  },

  resumeSurvey: async (id: string) => {
    const res = await api.patch(`/surveys/${id}/resume`);
    return res.data.data;
  },

  finishSurvey: async (id: string) => {
    const res = await api.patch(`/surveys/${id}/finish`);
    return res.data.data;
  },

  getAnalysis: async (id: string) => {
    const res = await api.get(`/surveys/${id}/analysis`);
    return res.data;
  },

  exportStats: async (id: string) => {
    const res = await api.get(`/surveys/${id}/stats/export`);
    return res.data.data;
  },

  getMetrics: async (id: string) => {
    const res = await api.get(`/surveys/${id}/current-calls/stats`);
    return res.data.data;
  },

  fetchCdrs: async (id: string, filters?: any): Promise<FetchCdrsResponse> => {
    const queryString = objToQueryString(filters || {});
    const res = await api.get(`/surveys/${id}/cdrs?${queryString}`);
    return res.data.data;
  },

  fetchUncompletedRequests: async (
    id: string,
    page: number = 1,
    limit: number = 10,
    filters?: any,
  ): Promise<FetchUncompletedResponse> => {
    const queryString = objToQueryString({ page, limit, ...filters });
    const res = await api.get(
      `/surveys/${id}/uncompleted-requests?${queryString}`,
    );
    return res.data.data;
  },

  exportUncompletedRequests: async (id: string) => {
    const res = await api.get(`/surveys/${id}/uncompleted-requests/export`);
    return res.data;
  },

  uploadSurveySound: async (
    file: File,
  ): Promise<{ path: string; originalName: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/survey-sounds/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  createSurvey: async (data: any) => {
    const res = await api.post("/surveys", data);
    return res.data.data.survey as { id: string; status: string; name: string };
  },

  uploadCustomersFile: async (id: string, file: File, isDraft: boolean) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("isDraft", String(isDraft));
    const res = await api.post(`/surveys/${id}/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
