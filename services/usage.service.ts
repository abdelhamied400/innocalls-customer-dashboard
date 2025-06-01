import { objToQueryString } from "@/lib/utils";
import api from "./api";
import { format } from "date-fns";

export interface UsageSummaryFilters {
  search: string;
  fromDate?: Date;
  toDate?: Date;
}

export default {
  fetchUsageSummary: async (filters: UsageSummaryFilters) => {
    const queryParams = objToQueryString({
      ...filters,
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
    });
    const res = await api.get(`/jera/stats-summary?${queryParams}`);
    return res.data;
  },
  fetchUsageDetailed: async (page = 1, pageSize = 10, filters = {}) => {
    const params = {
      page,
      pageSize,
      ...filters,
    };
    const res = await api.get("/usage/detailed", { params });
    return res.data;
  },
};
