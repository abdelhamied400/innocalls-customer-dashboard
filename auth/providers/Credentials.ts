import { getCookie, setCookie } from "cookies-next";
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
  authorize: async (credentials, req) => {
    const email = credentials.email as string;
    const password = credentials.password as string;
    const userType = (credentials.userType || "user") as "user" | "agent";

    const { ip } = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-ip`)
      .then((res) => res.json())
      .catch(() => ({}));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v2/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Type": userType,
          "X-Client-IP": ip as string,
        },
        body: JSON.stringify({ email, password, userType }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new AuthError(errorData.message || "Login failed");
    }

    const res = await response.json();

    setCookie("OrganizationId", res.organizations?.[0]?.id || "");

    return {
      ...res.user,
      ...res.agent,
      organizations: res.organizations || [res.agent.organization],
      accessToken: res.accessToken,
      userType,
    };
  },
});

export default CredentialsProvider;
