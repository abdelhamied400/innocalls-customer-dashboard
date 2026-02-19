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

export type CallerInfo = {
  callerNumber: string;
  callerName: string;
};

export type WaitingCall = {
  waitTime: number;
  callerInfo: CallerInfo;
};

export type InProgressCall = {
  agentId: string;
  callerInfo: CallerInfo;
};

export type AgentDetail = {
  agentId: string;
  status: string;
  currentChannels: string[];
};

export type CampaignMetrics = {
  totalAgents: number;
  onlineAgents: number;
  availableAgents: number;
  onCallAgents: number;
  dialingAgents: number;
  onBreakAgents: number;
  oldestCallWaitTime: number;
  averageCurrentWaitTime: number;
  callsWaiting: number;
  callsInProgress: number;
  waitingCalls: WaitingCall[];
  inProgressCalls: InProgressCall[];
  agentDetails: AgentDetail[];
};

export type CorruptedRow = {
  id: string;
  row: {
    phone: string;
    name: string;
    information: string;
  };
  status: string;
  reasons: string[];
};

export type UncompletedRequest = {
  id: string;
  name: string;
  phone: string;
  remainingTrials: number;
};

export type CampaignCdr = {
  id: string;
  status:
    | "User did not answer"
    | "Airplane Mode Enabled"
    | "Initiated"
    | "Processing"
    | "Call Failed"
    | "User Busy/Rejected By User"
    | "User Connected"
    | "User Unreachable (Out of Network Coverage or Airplane Mode)"
    | "Completed"
    | "Timeout"
    | "Abandoned";
  customerConnectedAt: {
    date: string;
    time: string;
  };
  waitingTime: string;
  talkTime: string;
  duration: string;
  agentConnectedAt: {
    date: string;
    time: string;
  };
  agent: string;
  recordingLink: string;
  phone: string;
  name: string;
  information: string;
};
