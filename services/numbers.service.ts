import api from "./api";

export default {
  fetchNumbers: async () => {
    const res = await api.get(`/jera/dids`);
    return res.data.map((number: string, idx: number) => ({
      id: (idx + 1).toString().padStart(6, "0"),
      number,
    }));
  },
};
