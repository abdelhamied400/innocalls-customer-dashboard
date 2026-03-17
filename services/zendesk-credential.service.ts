import api from "./api";
import { ZendeskCredential } from "@/types/api/zendesk-credential";

export default {
  getAll: async (): Promise<ZendeskCredential[]> => {
    const res = await api.get<ZendeskCredential[]>("/zendesk-credential");
    return res.data;
  },
  create: async (): Promise<{ apiKey: string }> => {
    const res = await api.post<ZendeskCredential>("/zendesk-credential");
    return { apiKey: res.data.apiKey };
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/zendesk-credential/${id}`);
  },
  restore: async (id: string): Promise<void> => {
    await api.patch(`/zendesk-credential/${id}/restore`);
  },
};
