import api from "./api";
import { WebRTCCredential } from "@/types/api/webrtc-credential";

export default {
  getAll: async (): Promise<WebRTCCredential[]> => {
    const res = await api.get<WebRTCCredential[]>(
      "/v1/web-rtc-credential",
    );
    return res.data;
  },
  create: async (domains: string[]): Promise<WebRTCCredential> => {
    const res = await api.post<WebRTCCredential>("/v1/web-rtc-credential", {
      domains,
    });
    return res.data;
  },
  update: async (id: string, domains: string[]): Promise<void> => {
    await api.put(`/v1/web-rtc-credential/${id}`, { domains });
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/web-rtc-credential/${id}`);
  },
  restore: async (id: string): Promise<void> => {
    await api.patch(`/v1/web-rtc-credential/${id}/restore`);
  },
};
