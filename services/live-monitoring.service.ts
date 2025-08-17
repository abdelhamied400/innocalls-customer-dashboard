import { PerformanceStatsFiltersType } from "@/app/[locale]/(dashboard)/live-monitoring/PerformanceStats";
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
  answerRate: {
    current: number;
    change: number;
    previous: number;
  };
  totalWaitTime: {
    current: number;
    change: number;
    previous: number;
  };
  totalTalkTime: {
    current: number;
    change: number;
    previous: number;
  };
  slaPercent: {
    current: number;
    change: number;
    previous: number;
  };
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

    return {
      ...res.data,
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
