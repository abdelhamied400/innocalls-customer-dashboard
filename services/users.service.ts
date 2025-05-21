import api from "./api";

export default {
  getUsers: async () => {
    const res = await api.get("/extension/list");
    return res.data;
  },
};
