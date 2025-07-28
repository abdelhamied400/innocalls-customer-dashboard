import api from "./api";

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

export default {
  fetchQueueData: async (): Promise<FetchQueueDataResponse> => {
    const res = await api.get("/queue-live-monitor");
    return res.data;
  },
};
