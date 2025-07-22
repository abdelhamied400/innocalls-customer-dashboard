import { format } from "date-fns";
import api from "./api";
import { InboundAnalyticsFilters } from "@/app/[locale]/(dashboard)/user/analytics/inbound/page";

type FetchAnalyticsStatsResponse = {
  answerRate: number;
  answeredCalls: number;
  avgDuration: string;
  externalCalls: number;
  totalCalls: number;
  unansweredCalls: number;
};

type FetchAnalyticsOverviewResponse = Array<{
  answeredCalls: number;
  externalCalls: number;
  hourOfDay: number;
  internalCalls: number;
  totalCalls: number;
  unansweredCalls: number;
}>;

type FetchTimeDistributionResponse = Array<{
  timeBucket: string;
  totalCalls: number;
}>;

type FetchAnalyticsAgentPerformanceResponse = {
  agents: Array<{
    agentId: string;
    totalCalls: number;
    answeredCalls: number;
    unansweredCalls: number;
    avgDuration: string;
  }>;
};

type FetchAnalyticsIVRAnalysisResponse = Array<{
  name: string;
  options: Array<{
    option: string;
    count: number;
  }>;
}>;

export type IVRAnalysisChartData = Array<{
  ivrName: string;
  [key: string]: string | number; // Dynamic keys for option1, option2, etc.
}>;

type FetchAnalyticsRepeatedCallersResponse = {
  repeatedCallers: Array<{
    callerId: string;
    totalCalls: number;
    lastCallDate: string;
  }>;
};

export default {
  fetchQuickStats: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsStatsResponse> => {
    const res = await api.get(`/inbound-reports/summary`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data.summary;
  },
  fetchOverview: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsOverviewResponse> => {
    const res = await api.get(`/inbound-reports/hourly-call-distribution`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data.hourlyDistribution;
  },
  fetchWaitTimeDistribution: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchTimeDistributionResponse> => {
    const res = await api.get(`/inbound-reports/wait-time-distribution`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data.waitTimeDistribution;
  },
  fetchTalkTimeDistribution: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchTimeDistributionResponse> => {
    const res = await api.get(`/inbound-reports/talk-time-distribution`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data.talkTimeDistribution;
  },
  fetchIVRAnalysis: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsIVRAnalysisResponse> => {
    const res = await api.get(`/inbound-reports/ivr-options`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data.data;
  },
  fetchIVRAnalysisChartData: async (
    filters: InboundAnalyticsFilters
  ): Promise<IVRAnalysisChartData> => {
    const res = await api.get(`/inbound-reports/ivr-options`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });

    const rawData: FetchAnalyticsIVRAnalysisResponse = res.data.data;

    // Transform the data for chart consumption
    const chartData = rawData?.map((ivr) => {
      const optionData: any = { ivrName: ivr.name };
      ivr.options.forEach((option) => {
        optionData[`option${option.option}`] = option.count;
      });
      return optionData;
    });

    return chartData || [];
  },
  fetchAgentPerformance: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsAgentPerformanceResponse> => {
    const res = await api.get(`/inbound-reports/agent-performance`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data;
  },
  fetchRepeatedCallers: async (
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsRepeatedCallersResponse> => {
    const res = await api.get(`/inbound-reports/repeated-callers`, {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts: filters.agents?.length ? filters.agents.join(",") : undefined,
      },
    });
    return res.data;
  },
};
