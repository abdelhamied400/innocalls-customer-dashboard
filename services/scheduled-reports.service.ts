import {
  CreateScheduledReportPayload,
  ScheduledReport,
  ScheduledReportFilters,
  ScheduledReportHistoryResponse,
  ScheduledReportListResponse,
  ScheduledReportResponse,
  UpdateScheduledReportPayload,
} from "@/types/api/report";
import api from "./api";
import { format } from "date-fns";

type FetchScheduledReportsParams = {
  page: number;
  limit: number;
  filters?: ScheduledReportFilters;
};

export default {
  fetchAll: async ({
    page,
    limit,
    filters,
  }: FetchScheduledReportsParams): Promise<ScheduledReportListResponse> => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (filters?.search) {
      params.search = filters.search;
    }

    if (filters?.fromDate) {
      params.fromDate = format(filters.fromDate, "yyyy-MM-dd");
    }

    if (filters?.toDate) {
      params.toDate = format(filters.toDate, "yyyy-MM-dd");
    }

    if (filters?.frequency) {
      params.frequency = filters.frequency;
    }

    if (filters?.status) {
      params.status = filters.status;
    }

    const res = await api.get("/v1/reports/scheduled", { params });
    return res.data;
  },

  fetchById: async (id: string): Promise<ScheduledReport> => {
    const res = await api.get<ScheduledReportResponse>(
      `/v1/reports/scheduled/${id}`
    );
    return res.data.report;
  },

  create: async (
    payload: CreateScheduledReportPayload
  ): Promise<ScheduledReport> => {
    const res = await api.post("/v1/reports/scheduled", payload);
    return res.data;
  },

  update: async (
    id: string,
    payload: UpdateScheduledReportPayload
  ): Promise<ScheduledReport> => {
    const res = await api.put(`/v1/reports/scheduled/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/reports/scheduled/${id}`);
  },

  generateNow: async (id: string): Promise<void> => {
    await api.post(`/v1/reports/scheduled/${id}/generate-now`);
  },

  activate: async (id: string): Promise<ScheduledReport> => {
    const res = await api.patch(`/v1/reports/scheduled/${id}/activate`);
    return res.data;
  },

  deactivate: async (id: string): Promise<ScheduledReport> => {
    const res = await api.patch(`/v1/reports/scheduled/${id}/deactivate`);
    return res.data;
  },

  fetchHistory: async (
    id: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ScheduledReportHistoryResponse> => {
    const res = await api.get(`/v1/reports/scheduled/${id}/history`, {
      params: { page, limit },
    });
    return res.data;
  },
};
