import api from "./api";
import { ZohoCredential } from "@/types/api/zoho-credential";

export default {
  getAll: async (): Promise<ZohoCredential[]> => {
    const res = await api.get<ZohoCredential[]>("/zoho-credential");
    return res.data;
  },
  create: async (): Promise<{ apiKey: string }> => {
    const res = await api.post<ZohoCredential>("/zoho-credential");
    return { apiKey: res.data.apiKey };
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/zoho-credential/${id}`);
  },
  restore: async (id: string): Promise<void> => {
    await api.patch(`/zoho-credential/${id}/restore`);
  },
};
