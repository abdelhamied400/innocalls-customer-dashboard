import NextAuth from "next-auth";
import CredentialsProvider from "./providers/Credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [CredentialsProvider],
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { token: jwt, userType, accessToken, organizations } = user;
        token.jwt = jwt; // Changed from token.accessToken to avoid conflict
        token.userType = userType;
        token.accessToken = accessToken;
        token.organizations = organizations;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.userType = token.userType;
      session.organizations = token.organizations;

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  },
});
