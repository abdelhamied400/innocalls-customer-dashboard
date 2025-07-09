import api from "./api";

export default {
  getExtension: async (id: string) => {
    const res = await api.get(`/extension/login/${id}`);
    return res.data;
  },
  listContacts: async (page = 1, limit = 10) => {
    const res = await api.get(`/v2/contacts?page=${page}&limit=${limit}`);
    return res.data;
  },
  createContact: async (contact: any) => {
    const res = await api.post("/v2/contacts", contact);
    return res.data;
  },
  updateContact: async (id: string, contact: any) => {
    const res = await api.put(`/v2/contacts/${id}`, contact);
    return res.data;
  },
  deleteContact: async (id: string) => {
    const res = await api.delete(`/v2/contacts/${id}`);
    return res.data;
  },
};
