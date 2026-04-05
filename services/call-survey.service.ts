import api from "./api";
import { CallSurvey, CallSurveyDetail } from "@/types/callSurvey";
import { objToQueryString } from "@/lib/utils";

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
    return res.data.data;
  },

  exportStats: async (id: string) => {
    const res = await api.get(`/surveys/${id}/stats/export`);
    return res.data.data;
  },

  getMetrics: async (id: string) => {
    const res = await api.get(`/surveys/${id}/current-calls/stats`);
    return res.data.data;
  },
};
