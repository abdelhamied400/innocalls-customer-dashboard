export type Organization = {
  id: string;
  name: string;
  hasTenant: boolean;
  listenToCallEvents: boolean;
  provider: string;
  enableAfterCallTags: boolean;
  enableCallTranscription?: boolean;
  isDemo: boolean;
  allowedBreakTypes: Array<AgentActivity>;
  paymentCurrency: string;
  status: "active" | "pending";
};
