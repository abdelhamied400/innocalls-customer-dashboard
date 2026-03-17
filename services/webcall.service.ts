import api from "./api";
import {
  WebCallApp,
  CreateWebCallAppPayload,
  CreateWebCallAppResponse,
  UpdateWebCallAppPayload,
} from "@/types/api/webcall";

export default {
  getAll: async (): Promise<WebCallApp[]> => {
    const res = await api.get<{ apps: WebCallApp[] }>(
      "/v2/normal-web-call",
    );
    return res.data.apps;
  },
  getById: async (id: string): Promise<WebCallApp> => {
    const res = await api.get<{ app: WebCallApp }>(
      `/v2/normal-web-call/${id}`,
    );
    return res.data.app;
  },
  create: async (
    data: CreateWebCallAppPayload,
  ): Promise<CreateWebCallAppResponse> => {
    const res = await api.post<CreateWebCallAppResponse>(
      "/v2/normal-web-call",
      data,
    );
    return res.data;
  },
  update: async (id: string, data: UpdateWebCallAppPayload): Promise<void> => {
    await api.put(`/v2/normal-web-call/${id}`, data);
  },
  enable: async (id: string): Promise<void> => {
    await api.patch(`/v2/normal-web-call/${id}/enable`);
  },
  disable: async (id: string): Promise<void> => {
    await api.patch(`/v2/normal-web-call/${id}/disable`);
  },
};
