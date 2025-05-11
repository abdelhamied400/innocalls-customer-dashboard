import { format } from "date-fns";
import api from "./api";

export default {
  // statistics
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
