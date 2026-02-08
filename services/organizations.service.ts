import api from "./api";

export default {
  updateOrganizationName: async (data: { name: string }) => {
    const res = await api.patch("/organization/name", data);
    return res.data;
  },
};
