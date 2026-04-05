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
};
