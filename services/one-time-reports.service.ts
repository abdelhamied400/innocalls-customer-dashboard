import {
  CreateOneTimeReportPayload,
  OneTimeReport,
  OneTimeReportFilters,
  OneTimeReportListResponse,
  OneTimeReportResponse,
} from "@/types/api/report";
import api from "./api";
import { format } from "date-fns";

type FetchOneTimeReportsParams = {
  page: number;
  limit: number;
  filters?: OneTimeReportFilters;
};

export default {
  fetchAll: async ({
    page,
    limit,
    filters,
  }: FetchOneTimeReportsParams): Promise<OneTimeReportListResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (filters?.name) {
      params.name = filters.name;
    }

    if (filters?.fromDate) {
      params.fromDate = format(filters.fromDate, "yyyy-MM-dd");
    }

    if (filters?.toDate) {
      params.toDate = format(filters.toDate, "yyyy-MM-dd");
    }

    if (filters?.sortBy) {
      params.sortBy = filters.sortBy;
    }

    if (filters?.sortOrder) {
      params.sortOrder = filters.sortOrder;
    }

    const res = await api.get("/v1/reports/one-time", { params });
    return res.data;
  },

  fetchById: async (id: string): Promise<OneTimeReport> => {
    const res = await api.get<OneTimeReportResponse>(
      `/v1/reports/one-time/${id}`,
    );
    return res.data.report;
  },

  create: async (
    payload: CreateOneTimeReportPayload,
  ): Promise<OneTimeReport> => {
    const res = await api.post("/v1/reports/one-time", payload);
    return res.data;
  },
};
