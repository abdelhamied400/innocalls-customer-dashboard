import api from "./api";

type SearchAgentLiveCallsResponse = {
  callId: string;
};
type SaveCallSummaryPayload = {
  comment: string;
  postCallTags: Array<string>;
  callId: string;
  from: string;
  to: string;
  direction: string;
  duration: number;
  callDateTime: string;
  status: "Answered" | "Busy" | "Failed" | "Unanswered";
};

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
  getAgentExtension: async () => {
    const res = await api.get("/extension/agent-info");
    return res.data.agent;
  },
  searchAgentLiveCalls: async (
    phone: string
  ): Promise<SearchAgentLiveCallsResponse> => {
    return new Promise((resolve) => setTimeout(resolve, 500)).then(async () => {
      const res = await api.get(
        `agent-calls/live?phone=${encodeURIComponent(phone)}`
      );
      return res.data;
    });
  },
  saveCallSummary: async (payload: SaveCallSummaryPayload) => {
    const res = await api.post("call-summary", payload);
    return res.data;
  },
};
