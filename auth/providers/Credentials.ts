import authService from "@/services/auth.service";
import { AxiosError } from "axios";
import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

class AuthError extends CredentialsSignin {
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

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
        userType,
      });

      return {
        ...res.user,
        ...res.agent,
        organizations: res.organizations || [res.agent.organization],
        accessToken: res.accessToken,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AuthError(error.response?.data.message);
      }
      // Handle other types of errors
      throw new AuthError(
        "An unexpected error occurred. Please try again later."
      );
    }
  },
});

export default CredentialsProvider;
