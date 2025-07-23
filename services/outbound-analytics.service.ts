import { OutboundAnalyticsFilters } from "@/app/[locale]/(dashboard)/user/analytics/outbound/page";
import api from "./api";
import { format } from "date-fns";

type FetchQuickStatsResponse = {
  totalCalls: number;
  unansweredCalls: number;
  answeredCalls: number;
  answerRate: number;
  externalCalls: number;
  avgDuration: string;
};
type FetchTalkTimeDistributionResponse = Array<{
  timeBucket: string;
  totalCalls: number;
}>;
type FetchHourlyDistributionResponse = Array<{
  hourOfDay: number;
  totalCalls: number;
  internalCalls: number;
  externalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
}>;
type FetchDateDistributionResponse = Array<{
  date: string;
  totalCalls: number;
  internalCalls: number;
  externalCalls: number;
  totalAnsweredCalls: number;
  totalUnAnsweredCalls: number;
  answerRate: number;
  totalDuration: string;
  avgDuration: string;
  shortestCall: string;
  longestCall: string;
}>;
type FetchAgentStatsResponse = Array<{
  ext: string;
  name: string;
  totalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
  internalCalls: number;
  externalCalls: number;
  totalDuration: number;
  avgDuration: number;
}>;

export default {
  async fetchQuickStats(
    filters: OutboundAnalyticsFilters
  ): Promise<FetchQuickStatsResponse> {
    const response = await api.get("/outbound-reports/summary", {
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
  async fetchTalkTimeDistributionAnalytics(
    filters: OutboundAnalyticsFilters
  ): Promise<FetchTalkTimeDistributionResponse> {
    const response = await api.get("/outbound-reports/talk-time-distribution", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
      },
    });
    return response.data.talkTimeDistribution;
  },
  async fetchHourlyDistributionAnalytics(
    filters: OutboundAnalyticsFilters
  ): Promise<FetchHourlyDistributionResponse> {
    const response = await api.get(
      "/outbound-reports/hourly-call-distribution",
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
  async fetchDateDistributionAnalytics(
    filters: OutboundAnalyticsFilters
  ): Promise<FetchDateDistributionResponse> {
    const response = await api.get("/outbound-reports/call-distribution", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
      },
    });
    return response.data.callsDistribution;
  },
  async fetchAgentStatsAnalytics(
    filters: OutboundAnalyticsFilters
  ): Promise<FetchAgentStatsResponse> {
    const response = await api.get("/outbound-reports/agent-stats", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
      },
    });
    return response.data.agentStats;
  },
};
