import api from "./api";
import { FreshdeskCredential } from "@/types/api/freshdesk-credential";

export default {
  getAll: async (): Promise<FreshdeskCredential[]> => {
    const res = await api.get<{ credentials: FreshdeskCredential[] }>(
      "/v1/freshdesk-credentials",
    );
    return res.data?.credentials;
  },
  create: async (): Promise<{ apiKey: string }> => {
    const res = await api.post<{ credential: { apiKey: string } }>("/v1/freshdesk-credentials");
    return res.data.credential;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/freshdesk-credentials/${id}`);
  },
  restore: async (id: string): Promise<void> => {
    await api.patch(`/v1/freshdesk-credentials/${id}/restore`);
  },
};
