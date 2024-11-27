import NextAuth from "next-auth";
import CredentialsProvider from "./providers/Credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [CredentialsProvider],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { token: jwt, ...profile } = user;
        token.accessToken = jwt;
        token.profile = profile;
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
