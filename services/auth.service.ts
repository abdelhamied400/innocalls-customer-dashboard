import api from "./api";

type Credentials = {
  email: string;
  password: string;
  userType?: "user" | "agent";
};

export default {
  login: async ({ email, password, userType = "user" }: Credentials) => {
    const res = await api.post(
      `/v2/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "X-User-Type": userType,
        },
      }
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
      }
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
      }
    );

    return res.data;
  },
};
