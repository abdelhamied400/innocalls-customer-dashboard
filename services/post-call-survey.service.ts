import {
  PostCallSurveyAnalysis,
  PostCallSurveyCdr,
  PostCallSurveyDetail,
  PostCallSurveyDetailResponse,
  PostCallSurveyListResponse,
} from "@/types/api/post-call-survey";
import api from "./api";
import { objToQueryString } from "@/lib/utils";

type FetchCdrsResponse = {
  requests: PostCallSurveyCdr[];
  totalItems: number;
  totalPages: number;
};

type FetchPostCallSurveysParams = {
  page: number;
  limit: number;
  name?: string;
};

export default {
  fetchAll: async ({
    page,
    limit,
    name,
  }: FetchPostCallSurveysParams): Promise<PostCallSurveyListResponse> => {
    const params: Record<string, string | number | boolean> = {
      page,
      limit,
      isActive: true,
    };

    if (name) {
      params.name = name;
    }

    const res = await api.get("/survey-post-call-templates", { params });
    return res.data;
  },

  fetchById: async (id: string): Promise<PostCallSurveyDetail> => {
    const res = await api.get<PostCallSurveyDetailResponse>(
      `/survey-post-call-templates/${id}`,
    );
    return res.data.data.survey;
  },

  fetchCdrs: async (
    surveyId: string,
    filters?: any,
  ): Promise<FetchCdrsResponse> => {
    const queryString = objToQueryString(filters || {});
    const res = await api.get(
      `/survey-post-call-templates/${surveyId}/calls?${queryString}`,
    );
    return res.data.data;
  },

  getAnalysis: async (id: string): Promise<PostCallSurveyAnalysis> => {
    const res = await api.get(
      `/survey-post-call-templates/${id}/analytics`,
    );
    return res.data;
  },

  fetchAgentSurveys: async ({
    page,
    limit,
    name,
  }: FetchPostCallSurveysParams): Promise<PostCallSurveyListResponse> => {
    const params: Record<string, string | number> = { page, limit };
    if (name) params.name = name;
    const res = await api.get("/agent-surveys", { params });
    return res.data;
  },

  assignToCall: async (payload: {
    survey: string;
    phone: string;
    channelId: string;
    direction: string;
    hasDefaultSurvey: boolean;
  }): Promise<any> => {
    const res = await api.post("/post-call-surveys", payload);
    return res.data;
  },

  create: async (data: any): Promise<any> => {
    const res = await api.post("/survey-post-call-templates", data);
    return res.data;
  },

  exportReport: async (surveyId: string): Promise<void> => {
    await api.get(`/survey-post-call-templates/${surveyId}/calls/export`);
  },
};
