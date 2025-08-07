import api from "./api";
import { Paginated } from "@/types/shared/paginated";
import {
  Call,
  CallReportingFilters,
  ExportCallReportingFilters,
} from "@/types/api/call-reporting";
import { objectToQueryString } from "@/lib/queryParams";
import { format } from "date-fns";

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
      fromDate: filters?.fromDate
        ? format(filters.fromDate, "yyyy-MM-dd")
        : undefined,
      toDate: filters?.toDate
        ? format(filters.toDate, "yyyy-MM-dd")
        : undefined,
      sourceExtensions: filters?.sourceExtensions
        ? Array.isArray(filters.sourceExtensions)
          ? filters.sourceExtensions.map((ext) => ext.value).join(",")
          : filters.sourceExtensions
        : undefined,
      destinationExtensions: filters?.destinationExtensions
        ? Array.isArray(filters.destinationExtensions)
          ? filters.destinationExtensions.map((ext) => ext.value).join(",")
          : filters.destinationExtensions
        : undefined,
    });
    const res = await api.get(`/v2/cdrs/report?${queryString}`);
    return res.data;
  },
  exportCallReporting: async (
    filters: ExportCallReportingFilters
  ): Promise<void> => {
    const queryString = objectToQueryString(filters);
    const res = await api.get(`/v2/cdrs/export?${queryString}`);
    return res.data;
  },
  getCallRecording: async (callId: string): Promise<string> => {
    const res = await api.get(`/v2/cdrs/download-record/${callId}`);
    return res.data;
  },
  getPhoneHistory: async (phoneNumber: string) => {
    const res = await api.get(
      `/call-report/phone-call-history?phoneNumber=${phoneNumber}`
    );
    return res.data;
  },
};
