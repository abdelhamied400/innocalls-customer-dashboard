import api from "./api";
import {
  ApiCredential,
  CreateApiCredentialResponse,
} from "@/types/api/api-credential";

export default {
  getAll: async (): Promise<ApiCredential[]> => {
    const res = await api.get<ApiCredential[]>("/v1/api-credential");
    return res.data;
  },
  create: async (data: {
    title: string;
    services: string[];
  }): Promise<CreateApiCredentialResponse> => {
    const res = await api.post<CreateApiCredentialResponse>(
      "/v1/api-credential",
      data,
    );
    return res.data;
  },
  update: async (id: string, services: string[]): Promise<void> => {
    await api.put(`/v1/api-credential/${id}`, { services });
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/v1/api-credential/${id}`);
  },
  restore: async (id: string): Promise<void> => {
    await api.patch(`/v1/api-credential/${id}/restore`);
  },
};
