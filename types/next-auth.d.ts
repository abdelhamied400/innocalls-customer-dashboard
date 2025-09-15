import { DefaultJWT } from "next-auth/jwt";
import { Organization } from "./api/organization";

declare module "next-auth" {
  interface User {
    token?: string;
    id: string;
    userType: "user" | "agent";
    accessToken?: string;
    organizations?: Array<Organization>;
  }

  interface Session {
    accessToken?: string;
    userType: "user" | "agent";
    organizations?: Array<Organization>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userType: "user" | "agent";
    organizations?: Array<Organization>;
  }
}
