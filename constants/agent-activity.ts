type AgentActivityValue =
  | "logged_in"
  | "logged_out"
  | "connected_not_ready"
  | "ready_accept_call"
  | "break_started"
  | "break_ended"
  | "dialpad_logged_out"
  | "portal_logged_out";

export type AgentActivity = {
  value: AgentActivityValue;
  label: string;
  color: string;
};

export const agentActivities: Array<AgentActivity> = [
  // {
  //   value: "logged_in",
  //   label: "Logged In",
  //   color: "#2563eb", // Blue for active/logged in
  // },
  // {
  //   value: "logged_out",
  //   label: "Logged Out",
  //   color: "#6b7280", // Gray for logged out
  // },
  {
    value: "connected_not_ready",
    label: "Connected Not Ready",
    color: "#f59e42", // Orange for connected but not ready
  },
  {
    value: "ready_accept_call",
    label: "Ready Accept Call",
    color: "#22c55e", // Green for ready
  },
  {
    value: "break_started",
    label: "Break Started",
    color: "#eab308", // Yellow for break started
  },
  {
    value: "break_ended",
    label: "Break Ended",
    color: "#38bdf8", // Light blue for break ended
  },
  {
    value: "dialpad_logged_out",
    label: "Dialpad Logged Out",
    color: "#ef4444", // Red for dialpad logged out
  },
  // {
  //   value: "portal_logged_out",
  //   label: "Portal Logged Out",
  //   color: "#a21caf", // Purple for portal logged out
  // },
];
