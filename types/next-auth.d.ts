import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  type Organization = {
    name: string;
    hasTenant: boolean;
    listenToCallEvents: boolean;
    provider: string;
    enableAfterCallTags: boolean;
    isDemo: boolean;
  };

  interface User {
    token?: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    isDeleted: boolean;
    isActive: boolean;
    role: "user" | "agent";
    assignedExtensions: Array<any>;
    fullAccessNumbers: boolean;
    completeControlBilling: boolean;
    fullAccessUsageAnalytics: boolean;
    fullAccessOrderConfirmationCampaigns: boolean;
    fullAccessCallCampaigns: boolean;
    completeControlDeveloperTools: boolean;
    completeControlTicketing: boolean;
    fullAccessAutoDialerCampaigns: boolean;
    webrtcAccess: boolean;
    agentsAccessControl: boolean;
    fullAccessSurvey: boolean;
    fullAccessConferenceBridge: boolean;
    organizations: Organization[];
  }

  interface Session {
    accessToken?: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    profile: User;
  }
}
