import { UnansweredAnalyticsFilters } from "@/app/[locale]/(dashboard)/analytics/unanswered/page";
import api from "./api";
import { format } from "date-fns";

type FetchQuickStatsResponse = {
  totalExternalUnansweredIncomingCalls: number;
  totalExternalUnansweredOutgoingCalls: number;
  totalInternalUnansweredCalls: number;
  totalUnansweredCalls: number;
};

type FetchOutboundDistributionResponse = Array<{
  date: string;
  externalCalls: number;
  externalUnansweredCalls: number;
  internalCalls: number;
  internalUnansweredCalls: number;
  totalCalls: number;
  unansweredCalls: number;
}>;

type FetchOutboundUnansweredHourlyResponse = Array<{
  externalUnansweredCalls: number;
  hourOfDay: number;
  internalUnansweredCalls: number;
  unansweredCalls: number;
}>;

type FetchInboundDistributionResponse = Array<{
  date: string;
  externalCalls: number;
  externalUnansweredCalls: number;
  internalCalls: number;
  internalUnansweredCalls: number;
  totalCalls: number;
  unansweredCalls: number;
}>;

type FetchInboundUnansweredHourlyResponse = Array<{
  externalUnansweredCalls: number;
  hourOfDay: number;
  internalUnansweredCalls: number;
  unansweredCalls: number;
}>;

export default {
  fetchQuickStats: async (
    filters: UnansweredAnalyticsFilters
  ): Promise<FetchQuickStatsResponse> => {
    const response = await api.get("/unanswered-reports/summary", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
      },
    });
    return response.data.summary;
  },
  fetchOutboundDistribution: async (
    filters: UnansweredAnalyticsFilters
  ): Promise<FetchOutboundDistributionResponse> => {
    const response = await api.get(
      "/unanswered-outbound-reports/call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
          exts:
            filters.agents.length > 0
              ? filters.agents.map((agent) => agent.value).join(",")
              : undefined,
        },
      }
    );
    return response.data.callsDistribution;
  },
  fetchOutboundUnansweredHourly: async (
    filters: UnansweredAnalyticsFilters
  ): Promise<FetchOutboundUnansweredHourlyResponse> => {
    const response = await api.get(
      "/unanswered-outbound-reports/hourly-call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
          exts:
            filters.agents.length > 0
              ? filters.agents.map((agent) => agent.value).join(",")
              : undefined,
        },
      }
    );
    return response.data.hourlyDistribution;
  },
  fetchInboundDistribution: async (
    filters: UnansweredAnalyticsFilters
  ): Promise<FetchInboundDistributionResponse> => {
    const response = await api.get(
      "/unanswered-inbound-reports/call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
          exts:
            filters.agents.length > 0
              ? filters.agents.map((agent) => agent.value).join(",")
              : undefined,
        },
      }
    );
    return response.data.callsDistribution;
  },
  fetchInboundUnansweredHourly: async (
    filters: UnansweredAnalyticsFilters
  ): Promise<FetchInboundUnansweredHourlyResponse> => {
    const response = await api.get(
      "/unanswered-inbound-reports/hourly-call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
          exts:
            filters.agents.length > 0
              ? filters.agents.map((agent) => agent.value).join(",")
              : undefined,
        },
      }
    );
    return response.data.hourlyDistribution;
  },
};
