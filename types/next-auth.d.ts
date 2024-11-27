import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      name: string;
      email: string;
      role: string;
      emailVerified: Date;
    };
  }

  interface User {
    token?: string;
    id?: string;
    name: string;
    email: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    profile: User;
  }
}
