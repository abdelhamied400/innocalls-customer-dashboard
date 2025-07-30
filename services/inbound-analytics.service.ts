import { format } from "date-fns";
import api from "./api";
import { InboundAnalyticsFilters } from "@/app/[locale]/(dashboard)/user/analytics/inbound/page";
import { durationToSeconds, formatDuration } from "@/lib/date";
type FetchAnalyticsStatsResponse = {
  answerRate: number;
  answeredCalls: number;
  avgDuration: string;
  externalCalls: number;
  totalCalls: number;
  unansweredCalls: number;
  abandonedCalls?: number;
  averageWaitTime?: string;
  averageTalkTime?: string;
  timeoutCalls?: number;
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

type FetchAnalyticsAgentPerformanceResponse = Array<{
  avgTalkTime: string;
  avgWaitTime: string;
  callsHandled: number;
  ext: number;
  maxCustomerQueuePosition: number;
  minCustomerQueuePosition: number;
  name: string;
  totalTalkTime: string;
  totalWaitTime: string;
}>;

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

type FetchAnalyticsRepeatedCallersResponse = Array<{
  callerId: string;
  totalCalls: number;
  lastCallDate: string;
}>;

type FetchAnalyticsDateDistributionResponse = Array<{
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
}>;

type FetchQueueAbandonedAnalysisResponse = {
  avgInitialQueuePosition: number;
  avgWaitTime: number;
  maxInitialQueuePosition: number;
  maxWaitTime: number;
  minInitialQueuePosition: number;
  minWaitTime: number;
  peakHour: number;
  stats: Array<{ timeBucket: string; count: number }>;
  total: number;
  uniqueCallers: number;
};
type FetchQueueTimeoutAnalysisResponse = {
  avgInitialQueuePosition: number;
  avgWaitTime: number;
  maxInitialQueuePosition: number;
  maxWaitTime: number;
  minInitialQueuePosition: number;
  minWaitTime: number;
  peakHour: string;
  stats: Array<{ timeBucket: string; count: number }>;
  total: number;
  uniqueCallers: number;
};

const formatParams = (filters: InboundAnalyticsFilters) => ({
  fromDate: format(filters.fromDate, "yyyy-MM-dd"),
  toDate: format(filters.toDate, "yyyy-MM-dd"),
  exts: filters.agents?.length ? filters.agents.join(",") : undefined,
  queue: filters.queue,
});

export default {
  async fetchQuickStats(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsStatsResponse> {
    const baseUrl =
      filters.filterBy === "team" ? `inbound-queue-reports` : `inbound-reports`;
    const res = await api.get(`/${baseUrl}/summary`, {
      params: formatParams(filters),
    });
    return res.data.summary;
  },

  async fetchOverview(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsOverviewResponse> {
    const baseUrl =
      filters.filterBy === "team" ? `inbound-queue-reports` : `inbound-reports`;
    const res = await api.get(`/${baseUrl}/hourly-call-distribution`, {
      params: formatParams(filters),
    });
    return res.data.hourlyDistribution;
  },

  async fetchWaitTimeDistribution(
    filters: InboundAnalyticsFilters
  ): Promise<FetchTimeDistributionResponse> {
    const baseUrl =
      filters.filterBy === "team" ? `inbound-queue-reports` : `inbound-reports`;
    const res = await api.get(`/${baseUrl}/wait-time-distribution`, {
      params: formatParams(filters),
    });
    return res.data.waitTimeDistribution;
  },

  async fetchTalkTimeDistribution(
    filters: InboundAnalyticsFilters
  ): Promise<FetchTimeDistributionResponse> {
    const baseUrl =
      filters.filterBy === "team" ? `inbound-queue-reports` : `inbound-reports`;
    const res = await api.get(`/${baseUrl}/talk-time-distribution`, {
      params: formatParams(filters),
    });
    return res.data.talkTimeDistribution;
  },

  async fetchIVRAnalysis(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsIVRAnalysisResponse> {
    const res = await api.get(`/inbound-reports/ivr-options`, {
      params: formatParams(filters),
    });
    return res.data.data;
  },

  async fetchDateDistributionAnalytics(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsDateDistributionResponse> {
    const baseUrl =
      filters.filterBy === "team" ? `inbound-queue-reports` : `inbound-reports`;
    const res = await api.get(`/${baseUrl}/call-distribution`, {
      params: formatParams(filters),
    });
    return res.data.callsDistribution;
  },

  async fetchAgentPerformance(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsAgentPerformanceResponse> {
    const res = await api.get(
      `/inbound-queue-reports/agent-answered-calls-performance`,
      {
        params: formatParams(filters),
      }
    );
    return res.data.agents.map((agent: any) => ({
      ...agent,
      avgTalkTime: durationToSeconds(agent.avgTalkTime),
      avgWaitTime: durationToSeconds(agent.avgWaitTime),
    }));
  },

  async fetchRepeatedCallers(
    filters: InboundAnalyticsFilters
  ): Promise<FetchAnalyticsRepeatedCallersResponse> {
    const res = await api.get(`/inbound-queue-reports/repeated-callers`, {
      params: formatParams(filters),
    });
    return res.data.callers.map((caller: any) => ({
      ...caller,
      firstCallTime: format(caller.firstCallTime * 1000, "yyyy-MM-dd HH:mm:ss"),
      lastCallTime: format(caller.lastCallTime * 1000, "yyyy-MM-dd HH:mm:ss"),
    }));
  },
  async fetchQueueAbandonedAnalysis(
    filters: InboundAnalyticsFilters
  ): Promise<FetchQueueAbandonedAnalysisResponse> {
    const res = await api.get(`/inbound-queue-reports/abandoned-calls`, {
      params: formatParams(filters),
    });
    return {
      ...res.data,
      avgWaitTime: res.data.avgWaitTime.toFixed(2),
    };
  },
  async fetchQueueTimeoutAnalysis(
    filters: InboundAnalyticsFilters
  ): Promise<FetchQueueTimeoutAnalysisResponse> {
    const res = await api.get(`/inbound-queue-reports/timeout-calls`, {
      params: formatParams(filters),
    });
    return {
      ...res.data,
      avgWaitTime: res.data.avgWaitTime.toFixed(2),
    };
  },
};
