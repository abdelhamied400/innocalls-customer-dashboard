import api from "./api";

export default {
  fetchNumbers: async (page: string, pageSize: string, filters: any) => {
    const res = await api.get(`/jera/dids?page=${page}&pageSize=${pageSize}`);
    return res.data.map((number: string) => ({
      id: number,
      number,
    }));
  },
};
