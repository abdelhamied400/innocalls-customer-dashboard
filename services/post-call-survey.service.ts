import {
  PostCallSurveyDetail,
  PostCallSurveyDetailResponse,
  PostCallSurveyListResponse,
} from "@/types/api/post-call-survey";
import api from "./api";

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

  exportReport: async (surveyId: string): Promise<void> => {
    await api.get(`/survey-post-call-templates/${surveyId}/calls/export`);
  },
};
