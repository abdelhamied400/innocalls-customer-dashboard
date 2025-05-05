import api from "./api";

export default {
  // statistics
  // ------->
  // erg-statistics
  getErgInProgressCallsCount: async () => {
    const res = await api
      .get("/erg-statistics/inprogress-calls-count")
      .catch((err) => {
        console.error(
          "Error fetching in-progress calls count:",
          err.response.data
        );
        return err.response.data;
      });
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
