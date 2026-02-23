export type AgentCampaign = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  agentStatus: "left" | "joined";
  agentCanLogoutAndRejoin: boolean;
};

export type AgentCampaignCdr = {
  id: string;
  status: string;
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
