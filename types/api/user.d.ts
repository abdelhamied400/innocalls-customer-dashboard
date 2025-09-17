import { AgentActivity } from "../webrtc";

export type User = {
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
  latestActivity?: {
    type: AgentActivity;
    subType?: string;
  };
};
