import { AgentActivityValue } from "@/constants/agent-activity";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  type Organization = {
    id: string;
    name: string;
    hasTenant: boolean;
    listenToCallEvents: boolean;
    provider: string;
    enableAfterCallTags: boolean;
    isDemo: boolean;
    allowedBreakTypes: Array<string>;
  };

  interface User {
    token?: string;
    id: string;
    name: string;
    email: string;
    phone: string;
    isDeleted: boolean;
    isActive: boolean;
    userType: "user" | "agent";
    role: "Admin" | "Supervisor";
    assignedExtensions: Array<any>;
    fullAccessNumbers: boolean; // numbers tab
    completeControlBilling: boolean; // billing tab
    fullAccessUsageAnalytics: boolean; // usage tab
    fullAccessOrderConfirmationCampaigns: boolean;
    fullAccessCallCampaigns: boolean;
    completeControlDeveloperTools: boolean;
    completeControlTicketing: boolean;
    fullAccessAutoDialerCampaigns: boolean;
    webrtcAccess: boolean; // webrtc
    agentsAccessControl: boolean; // users tab
    fullAccessSurvey: boolean;
    fullAccessConferenceBridge: boolean;
    organizations: Organization[];
    accessToken?: string;
    latestActivity: {
      type: AgentActivityValue;
    };
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
