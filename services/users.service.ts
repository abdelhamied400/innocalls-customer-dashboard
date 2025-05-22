import api from "./api";

export default {
  getUsers: async () => {
    const res = await api.get("/extension/list");
    return res.data;
  },
  getUsersMonitor: async () => {
    const res = await api.get("/extension/monitor");
    return res.data;
  },
};
