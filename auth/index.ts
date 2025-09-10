import NextAuth from "next-auth";
import CredentialsProvider from "./providers/Credentials";
import authService from "@/services/auth.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [CredentialsProvider],
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger, account }) {
      if (user) {
        const { token: jwt, ...profile } = user;
        token.accessToken = jwt;
        token.profile = profile;
      }

      if (trigger === "update") {
        const updatedUser = await authService.fetchUserProfile();
        token.profile.latestActivity = updatedUser.latestActivity;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.profile;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
