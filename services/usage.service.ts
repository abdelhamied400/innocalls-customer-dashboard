import { objToQueryString } from "@/lib/utils";
import api from "./api";
import { format } from "date-fns";

export interface UsageSummaryFilters {
  search: string;
  fromDate?: Date;
  toDate?: Date;
  groupBy?: string[];
}

export interface UsageDetailedFilters {
  codeName?: string;
  fromDate?: Date;
  toDate?: Date;
  accountId?: string;
  packageId?: string;
  origin?: string;
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
  fetchUsageDetailed: async (
    page = 1,
    itemsPerPage = 10,
    filters: UsageDetailedFilters = {}
  ) => {
    const params = {
      page,
      itemsPerPage,
      ...filters,
    };
    const queryParams = objToQueryString({
      ...params,
      fromDate: params.fromDate
        ? format(params.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: params.toDate ? format(params.toDate, "yyyy-MM-dd") : undefined,
      codeName: params.codeName || undefined,
      accountId: params.accountId || undefined,
      packageId: params.packageId || undefined,
      origin: params.origin || undefined,
    });
    const res = await api.get(`/jera/stats-detailed?${queryParams}`);
    return res.data;
  },
  exportUsageDetailed: async (filters: UsageDetailedFilters = {}) => {
    const queryParams = objToQueryString({
      ...filters,
      fromDate: filters.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters.toDate ? format(filters.toDate, "yyyy-MM-dd") : undefined,
      codeName: filters.codeName || undefined,
      accountId: filters.accountId || undefined,
      packageId: filters.packageId || undefined,
      origin: filters.origin || undefined,
    });
    const res = await api.get(`/jera/stats-detailed/export?${queryParams}`);
    return res.data;
  },
};
