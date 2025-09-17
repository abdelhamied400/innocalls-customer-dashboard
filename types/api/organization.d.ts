export type Organization = {
  id: string;
  name: string;
  hasTenant: boolean;
  listenToCallEvents: boolean;
  provider: string;
  enableAfterCallTags: boolean;
  isDemo: boolean;
  allowedBreakTypes: Array<AgentActivity>;
};
