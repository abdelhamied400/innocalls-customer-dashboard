import api from "./api";
import { Paginated } from "@/types/shared/paginated";
import { Call, CallReportingFilters } from "@/types/api/call-reporting";
import { objectToQueryString } from "@/lib/queryParams";

export default {
  getCallReporting: async (
    page = 1,
    limit = 10,
    filters?: CallReportingFilters
  ): Promise<Paginated<Call>> => {
    const queryString = objectToQueryString({
      page,
      limit,
      ...filters,
    });
    const res = await api.get(`/cdr/user/report?${queryString}`);
    return res.data;
  },
};
