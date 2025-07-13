import { format } from "date-fns";
import api from "./api";

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
};
