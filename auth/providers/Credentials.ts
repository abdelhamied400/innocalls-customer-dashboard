import authService from "@/services/auth.service";
import Credentials from "next-auth/providers/credentials";

const CredentialsProvider = Credentials({
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentials) => {
    const email = credentials.email as string;
    const password = credentials.password as string;

    try {
      const res = await authService.login({ email, password });

      console.log(res);
      return {
        ...res.user,
        organizations: res.organizations,
      };
    } catch (err: any) {
      return null;
    }
  },
});

export default CredentialsProvider;
