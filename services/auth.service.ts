import api from "./api";
import { User } from "@/types/api/user";
import { Organization } from "@/types/api/organization";

type Credentials = {
  email: string;
  password: string;
  userType?: "user" | "agent";
  clientIp?: string;
};

type FetchProfileResponse = {
  id?: string;
  user: User;
  organizations: Array<Organization>;
  permissions: Array<string>;
};

export default {
  login: async ({ email, password, userType = "user", clientIp }: Credentials) => {
    const res = await api.post(
      `/v2/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "X-User-Type": userType,
          ...(clientIp ? { "X-Client-IP": clientIp } : {}),
        },
      },
    );

    return res.data;
  },
  forgotPassword: async (email: string, userType = "user") => {
    const res = await api.post(
      "/v2/auth/forget-password",
      {
        email,
      },
      {
        headers: {
          "X-User-Type": userType,
        },
      },
    );

    return res.data;
  },
  resetPassword: async (token: string, password: string, userType = "user") => {
    const res = await api.post(
      `/v2/auth/reset-password/${token}`,
      {
        password,
      },
      {
        headers: {
          "X-User-Type": userType,
        },
      },
    );

    return res.data;
  },
  fetchUserProfile: async (): Promise<FetchProfileResponse> => {
    const res = await api.get("/user/profile");
    return res.data;
  },
  fetchAgentProfile: async (): Promise<FetchProfileResponse> => {
    const res = await api.get("/agent/profile");
    return {
      user: res.data,
      organizations: [res.data.organization],
      permissions: [],
    };
  },
  updateUserPassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await api.patch("/user/change-password", {
      currentPassword: currentPassword,
      confirmedPassword: newPassword,
      newPassword: newPassword,
    });
  },
  verifyDemoAccount: async (token: string, password: string) => {
    const res = await api.post(`/v1/demo-requests/verify/${token}`, {
      password,
    });

    return res.data;
  },
  updateAgentPassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await api.patch("/agent/change-password", {
      currentPassword: currentPassword,
      confirmedPassword: newPassword,
      newPassword: newPassword,
    });
  },
};
