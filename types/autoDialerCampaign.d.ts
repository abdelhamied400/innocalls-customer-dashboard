import { AutoDialerCampaignActiveStatus } from "@/constants/auto-dialer";

export type AutoDialerCampaign = {
  id: string;
  name: string;
  durationType: "time-limited" | "agent-availability";
  trialsCount: number;
  fromTime: string;
  toTime: string;
  fileName: string;
  filePath: string;
  type: string;
  timezone: string;
  organization: string;
  status: AutoDialerCampaignActiveStatus;
  corruptedRows: number;
  correctRows: number;
  currentIndex: number;
  totalRows: number;
  createdAt: string;
  wrapUpTime: number;
  callers: {
    destination: string;
    callerNumber: string;
  }[];
  isDraft: boolean;
  maxWaitTime: number;
  delayMinutesBetweenTrials: number;
  hideCallerInfo: boolean;
  waitingCustomerCount: number;
  assignedAgents: number[];
  loopSoundFileName: string;
  mainSoundFileName: string;
  agentCanLogoutAndRejoin: boolean;
};
