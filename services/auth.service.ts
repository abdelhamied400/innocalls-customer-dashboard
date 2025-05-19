import api from "./api";

type Credentials = {
  email: string;
  password: string;
  userType?: "user" | "agent";
};

export default {
  login: async ({ email, password, userType = "user" }: Credentials) => {
    const res = await api.post(`/auth/${userType}/login`, {
      email,
      password,
    });

    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/user/forget-password", {
      email,
    });

    return res.data;
  },
};
