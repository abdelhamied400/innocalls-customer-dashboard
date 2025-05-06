import api from "./api";
const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => waitFor(Math.floor(Math.random() * 10000) + 500);

export default {
  // statistics
  // ------->
  // erg-statistics
  getErgInProgressCallsCount: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/inprogress-calls-count");
    return res.data;
  },
  getErgWaitingCallsCount: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/waiting-calls");
    return res.data;
  },
  getErgTodayCallsSummary: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/summary/today");
    return res.data;
  },
  getErgLast30DaysCallsSummary: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/summary/last-30-days");
    return res.data;
  },
  getErgTodayTalkTime: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/talk-time/today");
    return res.data;
  },
  getErgLast30DaysTalkTime: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/talk-time/last-30-days");
    return res.data;
  },
  getErgTodayWaitingTime: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/wait-time/today");
    return res.data;
  },
  getErgLast30DaysWaitingTime: async () => {
    await randomDelay();
    const res = await api.get("/erg-statistics/wait-time/last-30-days");
    return res.data;
  },
};
