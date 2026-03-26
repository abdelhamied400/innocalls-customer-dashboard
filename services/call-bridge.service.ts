import api from "./api";
import { CallBridge, CallBridgeDetail, UploadSoundResponse } from "@/types/callBridge";
import { objToQueryString } from "@/lib/utils";

type FetchBridgesResponse = {
  flows: CallBridge[];
  totalItems: number;
  totalPages: number;
};

export default {
  fetchBridges: async (filters?: any): Promise<FetchBridgesResponse> => {
    const queryString = objToQueryString(filters || {});
    const res = await api.get(`/conference-bridges?${queryString}`);
    return res.data.data;
  },

  getBridge: async (id: string): Promise<CallBridgeDetail> => {
    const res = await api.get(`/conference-bridges/${id}`);
    return res.data.data.flow;
  },

  createBridge: async (data: object) => {
    const res = await api.post("/conference-bridges", data);
    return res.data.data;
  },

  uploadSound: async (file: File): Promise<UploadSoundResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/bridge-sounds/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
