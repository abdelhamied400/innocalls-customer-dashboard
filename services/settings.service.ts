import api from "./api";

export default {
  toggleAfterCallSummary: async (): Promise<void> => {
    await api.patch("/organization/after-call-tags/toggle");
  },
};
