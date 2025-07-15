import { format } from "date-fns";
import api from "./api";

type GetTotalIncomingCallsResponse = {
  previousTotalCalls: number;
  totalCalls: number;
  totalCallsChangePercentage: number;
};

type GetTotalCallsStatsResponse = {
  abandoned: {
    count: number;
    percentage: number;
  };
  completed: {
    count: number;
    percentage: number;
  };
  previousTotalCalls: number;
  timeout: {
    count: number;
    percentage: number;
  };
  totalCalls: number;
  totalCallsChangePercentage: number;
};

type GetTalkTimeStatsResponse = {
  averageTalkTime: number;
  averageTalkTimeChangePercentage: number;
  dailyAverage: number;
  dailyAverageHours: number;
  peakHour: number;
  peakHourTalkTime: number;
  peakHourTalkTimeHours: number;
  previousTotalTalkTime: number;
  totalTalkTime: number;
  totalTalkTimeChangePercentage: number;
  totalTalkTimeHours: number;
};

type GetWaitingTimeStatsResponse = {
  averageWaitTime: number;
  averageWaitTimeChange: number;
  completedCalls: {
    averageWaitTime: number;
  };
  timeoutCalls: {
    averageWaitTime: number;
  };
  totalWaitTime: number;
  totalWaitTimeChangePercentage: number;
  abandonedCalls: {
    averageWaitTime: number;
  };
};

type QuickStatsResponse = {
  averageDailyCalls: number;
  bestResponseTime: number;
  dailyCallsResult: Array<{ date: string; dailyCalls: string }>;
  peakDay: string;
  totalCalls: number;
  totalCallsChangePercentage: number;
};

type CallsTrendResponse = {
  calls: Array<{
    total: number;
    missed: number;
    answered: number;
    date: string;
  }>;
};

type PerformanceOverviewResponse = {
  dailyMetrics: Array<{
    waitTime: number;
    talkTime: number;
    date: string;
  }>;
};

export default {
  // statistics
  // ------->
  // PBX
  getUsersCount: async () => {
    const res = await api.get("/extension/count");
    return res.data;
  },
  getOnlineUsersCount: async () => {
    const res = await api.get("/extension/online-count");
    return res.data;
  },
  getCallDistribution: async () => {
    const res = await api.get("/statistics/call-distribution");
    const callDistribution = res.data.data.callDistribution;
    const chartData = callDistribution.incoming.labels.map(
      (label: string, idx: number) => ({
        day: label.toUpperCase(),
        incomingCalls: callDistribution.incoming.values[idx],
        outgoingCalls: callDistribution.outgoing.values[idx],
      })
    );
    return chartData;
  },
  getTotalAnsweredCalls: async () => {
    const res = await api.get("/statistics/tenant-answered-calls");
    const totalCalls = res.data.data.totalCalls;

    const chartData = totalCalls.labels.map((label: string, idx: number) => ({
      day: label.slice(0, 1).toUpperCase(),
      totalCalls: totalCalls.values[idx],
    }));

    return chartData;
  },
  // ------->
  // Service level
  getLiveCallsCount: async () => {
    const res = await api.get("/extension/live-calls-count");
    return res.data;
  },
  getLastHourCallsDuration: async () => {
    const res = await api.get("/v2/cdrs/today");
    return res.data;
  },
  getTodayCallsDuration: async () => {
    const res = await api.get("/v2/cdrs/today");
    return res.data;
  },
  // ------->
  // billing
  getBalance: async () => {
    const res = await api.get("/jera/client-balance");
    return res.data;
  },
  getLast30DaysUsage: async () => {
    const res = await api.get(
      `/jera/usage?day=${format(new Date(), "yyyy-MM-dd")}`
    );
    return res.data;
  },
  getOverdueInvoices: async () => {
    const res = await api.get("/zoho/overdue-invoices");
    return res.data;
  },
  // ------->
  // erg-statistics
  getErgInProgressCallsCount: async () => {
    const res = await api.get("/erg-statistics/inprogress-calls-count");
    return res.data;
  },
  getErgWaitingCallsCount: async () => {
    const res = await api.get("/erg-statistics/waiting-calls");
    return res.data;
  },
  getErgTodayCallsSummary: async () => {
    const res = await api.get("/erg-statistics/summary/today");
    return res.data;
  },
  getErgLast30DaysCallsSummary: async () => {
    const res = await api.get("/erg-statistics/summary/last-30-days");
    return res.data;
  },
  getErgTodayTalkTime: async () => {
    const res = await api.get("/erg-statistics/talk-time/today");
    return res.data;
  },
  getErgLast30DaysTalkTime: async () => {
    const res = await api.get("/erg-statistics/talk-time/last-30-days");
    return res.data;
  },
  getErgTodayWaitingTime: async () => {
    const res = await api.get("/erg-statistics/wait-time/today");
    return res.data;
  },
  getErgLast30DaysWaitingTime: async () => {
    const res = await api.get("/erg-statistics/wait-time/last-30-days");
    return res.data;
  },
  // new stats
  getTotalIncomingCalls: async (): Promise<GetTotalIncomingCallsResponse> => {
    const res = await api.get("/inbound-statistics/total-calls");
    return res.data;
  },
  getTotalCallsStats: async (): Promise<GetTotalCallsStatsResponse> => {
    const res = await api.get("/inbound-statistics/call-completion-stats");
    return res.data;
  },
  getTalkTimeStats: async (): Promise<GetTalkTimeStatsResponse> => {
    const res = await api.get("/inbound-statistics/talk-time-metrics");
    return res.data;
  },
  getWaitingTimeStats: async (): Promise<GetWaitingTimeStatsResponse> => {
    const res = await api.get("/inbound-statistics/wait-time-metrics");
    return res.data;
  },
  getQuickStats: async (): Promise<QuickStatsResponse> => {
    const res = await api.get("/inbound-statistics/last-7-days-metrics");
    return {
      ...res.data,
      peakDay: format(new Date(res.data.peakDay), "EEEE"),
      averageDailyCalls: Math.round(res.data.averageDailyCalls * 100) / 100,
    };
  },
  getCallsTrend: async (): Promise<CallsTrendResponse> => {
    const res = await api.get("/inbound-statistics/calls-trends");
    return res.data;
  },
  getPerformanceOverview: async (): Promise<PerformanceOverviewResponse> => {
    const res = await api.get("/inbound-statistics/daily-time-metric");
    return res.data;
  },
};
