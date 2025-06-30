import api from "./api";

export default {
  getExtension: async (id: string) => {
    const res = await api.get(`/extension/login/${id}`);
    return res.data;
  },
};
