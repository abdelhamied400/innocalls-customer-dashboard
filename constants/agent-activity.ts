export type AgentActivityValue =
  | "logged_in"
  | "logged_out"
  | "connected_not_ready"
  | "ready_accept_call"
  | "break_started"
  | "break_ended"
  | "dialpad_logged_out"
  | "portal_logged_out";

export const agentActivitiesColors: Record<AgentActivityValue, string> = {
  logged_in: "#facc15",
  logged_out: "#3b82f6",
  connected_not_ready: "#ef4444",
  ready_accept_call: "#22c55e",
  break_started: "#eab308",
  break_ended: "#38bdf8",
  dialpad_logged_out: "#ef4444",
  portal_logged_out: "#22c55e",
};

export const webrtcStoppingActivities: AgentActivityValue[] = [
  "connected_not_ready",
  "break_started",
  "dialpad_logged_out",
  "portal_logged_out",
];

export type AgentActivity = {
  value: AgentActivityValue;
  label: string;
  color: string;
};

export const agentActivities: Array<AgentActivity> = [
  {
    value: "ready_accept_call",
    label: "Ready Accept Call",
    color: agentActivitiesColors.ready_accept_call,
  },
  {
    value: "break_started",
    label: "Take Break",
    color: agentActivitiesColors.break_started,
  },
  {
    value: "break_ended",
    label: "End Break",
    color: agentActivitiesColors.break_ended,
  },
  {
    value: "dialpad_logged_out",
    label: "Logout",
    color: agentActivitiesColors.dialpad_logged_out,
  },
];
