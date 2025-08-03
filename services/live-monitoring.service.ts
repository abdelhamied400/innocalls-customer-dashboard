import { PerformanceStatsFiltersType } from "@/app/[locale]/(dashboard)/user/live-monitoring/PerformanceStats";
import api from "./api";
import usersService, { Agent } from "./users.service";

export type FetchQueueDataResponse = Array<{
  queue: string;
  stats: {
    totalCalls: number;
    answeredCalls: number;
    abandonedCalls: number;
    timeoutCalls: number;
    averageWaitTime: string;
    averageWaitTimeSec: number;
    maxWaitTime: string;
    maxWaitTimeSec: number;
    minWaitTime: string;
    minWaitTimeSec: number;
    averageTalkTime: string;
    averageTalkTimeSec: number;
    maxTalkTime: string;
    maxTalkTimeSec: number;
    minTalkTime: string;
    minTalkTimeSec: number;
    slaCompliance: number;
  };
  activeCalls: Array<{
    caller: string;
    connectedAt: number;
    ext: string;
    name: string;
  }>;
  waitingCalls: Array<{
    caller: string;
    enteredAt: number;
  }>;
}>;

type FetchQueueStats = {
  answerRate: number;
  callsAnsweredWithinSLA: number;
  inboundAnswered: number;
  inboundCalls: number;
  outboundCalls: number;
  slaPercent: number;
  totalAnsweredCalls: number;
  totalCalls: number;
  totalWaitTime: number; // in seconds
  totalTalkTime: number; // in seconds
};

type FetchQueueStatsResponse = {
  current: FetchQueueStats;
  change: FetchQueueStats;
  previous: FetchQueueStats;
};

type FetchAgentsResponse = {
  online: Agent[];
  onCall: Agent[];
  offline: Agent[];
};

type LiveCall = {
  from: string;
  to: string;
  timestamp: number;
};

type FetchLiveCallsResponse = Array<LiveCall>;

export default {
  fetchQueueData: async (): Promise<FetchQueueDataResponse> => {
    const res = await api.get("/queue-live-monitor");
    return res.data;
  },
  fetchQueueStats: async ({
    filterType = "day",
    sla = 10,
  }: PerformanceStatsFiltersType): Promise<FetchQueueStatsResponse> => {
    const res = await api.get(`/daily-call-stats`, {
      params: { filterType, sla },
    });

    // TODO: Calculate change percentages for each stat until backend supports it
    const calculateChange = (current: number, previous: number): string => {
      return previous > 0
        ? (((current - previous) / previous) * 100).toFixed(2)
        : "0.00";
    };
    return {
      ...res.data,
      change: {
        answerRate: calculateChange(
          res.data.current.answerRate,
          res.data.previous.answerRate
        ),
        callsAnsweredWithinSLA: calculateChange(
          res.data.current.callsAnsweredWithinSLA,
          res.data.previous.callsAnsweredWithinSLA
        ),
        inboundAnswered: calculateChange(
          res.data.current.inboundAnswered,
          res.data.previous.inboundAnswered
        ),
        inboundCalls: calculateChange(
          res.data.current.inboundCalls,
          res.data.previous.inboundCalls
        ),
        outboundCalls: calculateChange(
          res.data.current.outboundCalls,
          res.data.previous.outboundCalls
        ),
        slaPercent: calculateChange(
          res.data.current.slaPercent,
          res.data.previous.slaPercent
        ),
        totalAnsweredCalls: calculateChange(
          res.data.current.totalAnsweredCalls,
          res.data.previous.totalAnsweredCalls
        ),
        totalCalls: calculateChange(
          res.data.current.totalCalls,
          res.data.previous.totalCalls
        ),
        totalWaitTime: calculateChange(
          res.data.current.totalWaitTime,
          res.data.previous.totalWaitTime
        ),
        totalTalkTime: calculateChange(
          res.data.current.totalTalkTime,
          res.data.previous.totalTalkTime
        ),
      },
    };
  },
  fetchAgents: async (): Promise<FetchAgentsResponse> => {
    const users = await usersService.getUsersMonitor();
    return {
      online: users.filter(
        (agent) => agent.status === "online" && !agent.on_call
      ),
      onCall: users.filter((agent) => agent.on_call),
      offline: users.filter((agent) => agent.status === "offline"),
    };
  },
  fetchLiveCalls: async (): Promise<FetchLiveCallsResponse> => {
    const res = await api.get("/extension/live-calls");
    return res.data;
  },
};
