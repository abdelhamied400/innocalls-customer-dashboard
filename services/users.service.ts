import { CreateUserSchema } from "@/validation/CreateUser";
import api from "./api";

export default {
  getUsers: async () => {
    const res = await api.get("/extension/list");
    return res.data;
  },
  getUsersMonitor: async () => {
    const res = await api.get("/extension/monitor");
    return res.data;
  },
  createUser: async (data: CreateUserSchema) => {
    const res = await api.post("/extension", data);
    return res.data;
  },
  getRecommendedNumber: async () => {
    const res = await api.get("extension/recommend-number");
    return res.data;
  },
  activateUser: async (id: string) => {
    const res = await api.patch(`/extension/active-status`, {
      extensionId: Number(id),
      activeStatus: 1,
    });
    return res.data;
  },
  deactivateUser: async (id: string) => {
    const res = await api.patch(`/extension/active-status`, {
      extensionId: Number(id),
      activeStatus: 0,
    });
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await api.delete(`/extension/${id}`);
    return res.data;
  },
};
