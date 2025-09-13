import { AgentActivity } from "@/types/webrtc";

export const agentActivitiesColors: Record<AgentActivity, string> = {
  [AgentActivity.LOGGED_IN]: "#facc15",
  [AgentActivity.LOGGED_OUT]: "#3b82f6",
  [AgentActivity.CONNECTED_NOT_READY]: "#ef4444",
  [AgentActivity.READY_ACCEPT_CALL]: "#22c55e",
  [AgentActivity.BREAK_STARTED]: "#eab308",
  [AgentActivity.BREAK_ENDED]: "#38bdf8",
  [AgentActivity.DIALPAD_LOGGED_OUT]: "#ef4444",
  [AgentActivity.PORTAL_LOGGED_OUT]: "#22c55e",
};

export const webrtcStoppingActivities: AgentActivity[] = [
  AgentActivity.CONNECTED_NOT_READY,
  AgentActivity.BREAK_STARTED,
  AgentActivity.DIALPAD_LOGGED_OUT,
  AgentActivity.PORTAL_LOGGED_OUT,
];

export type AgentActivityOption = {
  value: AgentActivity;
  label: string;
  color: string;
};

export const agentActivities: Array<AgentActivityOption> = [
  {
    value: AgentActivity.READY_ACCEPT_CALL,
    label: "Ready Accept Call",
    color: agentActivitiesColors[AgentActivity.READY_ACCEPT_CALL],
  },
  {
    value: AgentActivity.BREAK_STARTED,
    label: "Take Break",
    color: agentActivitiesColors[AgentActivity.BREAK_STARTED],
  },
  {
    value: AgentActivity.BREAK_ENDED,
    label: "End Break",
    color: agentActivitiesColors[AgentActivity.BREAK_ENDED],
  },
  {
    value: AgentActivity.DIALPAD_LOGGED_OUT,
    label: "Logout",
    color: agentActivitiesColors[AgentActivity.DIALPAD_LOGGED_OUT],
  },
];
