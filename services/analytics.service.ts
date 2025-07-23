import { format } from "date-fns";
import api from "./api";
import { UserActivityFilters } from "@/app/[locale]/(dashboard)/user/analytics/user-activity/page";

type FetchQuickStatsResponse = {
  topAnsweredIncomingAgent: {
    answeredIncomingCount: string;
    ext: string;
    name: string;
  };
  topConnectedOutboundAgent: {
    connectedOutboundCount: string;
    ext: string;
    name: string;
  };
  topSlaComplianceAgent: {
    answeredWithinSLA: string;
    ext: string;
    name: string;
    slaPercentage: number;
  };
  slaThreshold: number;
};

type FetchCallDistributionResponse = Array<{
  ext: string;
  name: string;
  totalCalls: number;
  totalIncomingCalls: number;
  totalOutgoingCalls: number;
  answeredIncomingCount: number;
  connectedOutboundCount: number;
}>;

type FetchCallStatsResponse = Array<{
  ext: string;
  name: string;
  totalCalls: number;
  avgCallDuration: string;
  answeredCount: number;
  totalTalkTime: string;
  longestCall: string;
  shortestCall: string;
  answerRate: number;
}>;

type FetchSlaComplianceResponse = Array<{
  answeredIncomingCalls: number;
  avgResponseTime: string;
  callsAnsweredWithinSLA: number;
  ext: string;
  name: string;
  slaCompliance: string | number;
  totalIncomingCalls: number;
}>;

export default {
  async fetchQuickStats(
    filters: UserActivityFilters
  ): Promise<FetchQuickStatsResponse> {
    const response = await api.get("/agent-reports/summary", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
        slaCompliance: filters.sla,
      },
    });
    return response.data.summary;
  },
  async fetchCallDistributionAnalytics(
    filters: UserActivityFilters
  ): Promise<FetchCallDistributionResponse> {
    const response = await api.get("/agent-reports/call-distribution", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
        slaCompliance: filters.sla,
      },
    });
    return response.data.callsDistribution;
  },
  async fetchCallStatsAnalytics(
    filters: UserActivityFilters
  ): Promise<FetchCallStatsResponse> {
    const response = await api.get("/agent-reports/performance", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
        slaCompliance: filters.sla,
      },
    });
    return response.data.agentPerformance;
  },
  async fetchSlaComplianceAnalytics(
    filters: UserActivityFilters
  ): Promise<FetchSlaComplianceResponse> {
    const response = await api.get("/agent-reports/response-time-analysis", {
      params: {
        fromDate: format(filters.fromDate, "yyyy-MM-dd"),
        toDate: format(filters.toDate, "yyyy-MM-dd"),
        exts:
          filters.agents.length > 0
            ? filters.agents.map((agent) => agent.value).join(",")
            : undefined,
        slaCompliance: filters.sla,
      },
    });
    return response.data.responseTimeAnalysis;
  },
};
