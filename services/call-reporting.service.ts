import api from "./api";
import { Paginated } from "@/types/shared/paginated";
import { Call, ExportCallReportingFilters } from "@/types/api/call-reporting";
import { objectToQueryString } from "@/lib/queryParams";
import { ColumnFiltersState } from "@tanstack/react-table";

export default {
  getCallReporting: async (
    page = 1,
    limit = 10,
    filters?: ColumnFiltersState
  ): Promise<Paginated<Call>> => {
    const filtersObj = filters?.reduce((acc, filter) => {
      if (filter.value) {
        acc[filter.id] = String(filter.value);
      }
      return acc;
    }, {} as Record<string, string>);

    const queryString = objectToQueryString({
      page,
      limit,
      ...filtersObj,
    });
    const res = await api.get(`/cdr/user/report?${queryString}`);
    return res.data;
  },
  exportCallReporting: async (
    filters: ExportCallReportingFilters
  ): Promise<void> => {
    const queryString = objectToQueryString(filters);
    const res = await api.get(`/cdr/user/export?${queryString}`);
    return res.data;
  },
};
