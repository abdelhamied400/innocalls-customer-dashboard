import { CreateUserSchema } from "@/validation/CreateUser";
import { EditUserSchema } from "@/validation/EditUser";
import api from "./api";
import CryptoJS from "crypto-js";

export default {
  getUsers: async () => {
    const res = await api.get("/extension/list");
    return res.data;
  },
  getUsersMonitor: async () => {
    const res = await api.get("/extension/monitor");
    return res.data;
  },
  getUserById: async (id: string) => {
    const res = await api.get(`/extension/show/${id}`);
    const passwordBytes = CryptoJS.AES.decrypt(
      res.data.password,
      "e6PyV2@*KYkNBFdU04CZ/n8x"
    );
    const decryptedPassword = passwordBytes.toString(CryptoJS.enc.Utf8);

    return {
      ...res.data,
      password: decryptedPassword, // Decrypt the password before returning
    };
  },
  createUser: async (data: CreateUserSchema) => {
    const res = await api.post("/extension", data);
    return res.data;
  },
  editUser: async (data: EditUserSchema) => {
    const res = await api.put(`/extension`, data);
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
