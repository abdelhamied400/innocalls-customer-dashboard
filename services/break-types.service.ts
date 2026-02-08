import {
  BreakType,
  CreateBreakTypePayload,
  UpdateBreakTypePayload,
} from "@/types/api/break-type";
import api from "./api";

export default {
  getAllBreakTypes: async (): Promise<BreakType[]> => {
    const res = await api.get("/v1/break-types");
    return res.data.breakTypes;
  },

  getBreakType: async (id: string): Promise<BreakType> => {
    const res = await api.get(`/v1/break-types/${id}`);
    return res.data.breakType;
  },

  createBreakType: async (data: CreateBreakTypePayload): Promise<BreakType> => {
    const res = await api.post("/v1/break-types", data);
    return res.data;
  },

  updateBreakType: async (
    id: string,
    data: UpdateBreakTypePayload,
  ): Promise<BreakType> => {
    const res = await api.put(`/v1/break-types/${id}`, data);
    return res.data;
  },

  deleteBreakType: async (id: string): Promise<void> => {
    await api.delete(`/v1/break-types/${id}`);
  },

  restoreBreakType: async (id: string): Promise<void> => {
    await api.patch(`/v1/break-types/${id}/restore`);
  },

  getAgentAvailableBreakTypes: async (): Promise<BreakType[]> => {
    const res = await api.get("/v1/break-types/agent/available");
    return res.data.breakTypes;
  },
};
