import authService from "@/services/auth.service";
import Credentials from "next-auth/providers/credentials";

const CredentialsProvider = Credentials({
  // You can specify which fields should be submitted, by adding keys to the `credentials` object.
  // e.g. domain, username, password, 2FA token, etc.
  credentials: {
    email: {},
    password: {},
    userType: {
      label: "User Type",
      type: "select",
      options: ["user", "agent"],
    },
  },
  authorize: async (credentials) => {
    const email = credentials.email as string;
    const password = credentials.password as string;
    const userType = (credentials.userType || "user") as "user" | "agent";

    try {
      const res = await authService.login({
        email,
        password,
        userType: userType,
      });

      return {
        ...res.user,
        ...res.agent,
        organizations: res.organizations || [res.agent.organization],
        accessToken: res.accessToken,
      };
    } catch (err: any) {
      console.log("Error in authorize:", err);
      return null;
    }
  },
});

export default CredentialsProvider;
