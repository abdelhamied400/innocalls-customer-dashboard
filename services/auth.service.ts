import api from "./api";

type Credentials = {
  email: string;
  password: string;
  userType?: "user" | "agent";
};
const login = async ({ email, password, userType = "user" }: Credentials) => {
  const res = await api.post(`/auth/${userType}/login`, {
    email,
    password,
  });

  return res.data;
};

export default {
  login,
};
