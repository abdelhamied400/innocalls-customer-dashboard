import { ActivityReportsFilters } from "@/app/(dashboard)/@agent/analytics/activity-reports/page";
import api from "./api";
import { format } from "date-fns";

type FetchQuickStatsResponse = {
  totalAnsweredCalls: number;
  totalCalls: number;
  totalIncomingCalls: number;
  totalOutgoingCalls: number;
  totalTalkTime: string;
  totalWaitTime: string;
};

type FetchCallDistributionResponse = Array<{
  date: string;
  totalAnsweredIncomingCalls: number;
  totalAnsweredOutgoingCalls: number;
  totalCalls: number;
  totalIncomingCalls: number;
  totalOutgoingCalls: number;
}>;

type FetchHourlyCallDistributionResponse = Array<{
  answeredCalls: number;
  hourOfDay: number;
  totalCalls: number;
  unansweredCalls: number;
}>;

type FetchTalkTimeDistributionResponse = Array<{
  totalTalkTime: number;
  timeBucket: string;
}>;

type FetchWaitTimeDistributionResponse = Array<{
  totalCalls: number;
  timeBucket: string;
}>;

export default {
  fetchQuickStats: async (
    filters: ActivityReportsFilters
  ): Promise<FetchQuickStatsResponse> => {
    const res = await api.get("/agent-activity-reports/summary", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
      },
    });

    return res.data.summary;
  },
  fetchDateCallDistribution: async (
    filters: ActivityReportsFilters
  ): Promise<FetchCallDistributionResponse> => {
    const res = await api.get(
      "/agent-activity-reports/date-call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
        },
      }
    );

    return res.data.dateDistribution;
  },
  fetchHourlyCallDistribution: async (
    filters: ActivityReportsFilters
  ): Promise<FetchHourlyCallDistributionResponse> => {
    const res = await api.get(
      "/agent-activity-reports/hourly-call-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
        },
      }
    );

    return res.data.hourlyDistribution;
  },
  fetchTalkTimeDistribution: async (
    filters: ActivityReportsFilters
  ): Promise<FetchTalkTimeDistributionResponse> => {
    const res = await api.get(
      "/agent-activity-reports/talk-time-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
        },
      }
    );

    return res.data.talkTimeDistribution;
  },
  fetchWaitTimeDistribution: async (
    filters: ActivityReportsFilters
  ): Promise<FetchWaitTimeDistributionResponse> => {
    const res = await api.get(
      "/agent-activity-reports/wait-time-distribution",
      {
        params: {
          fromDate: format(filters.fromDate, "yyyy-MM-dd"),
          toDate: format(filters.toDate, "yyyy-MM-dd"),
        },
      }
    );

    return res.data.waitTimeDistribution;
  },
};
