"use client";

import AgentStats from "@/containers/agent/AgentStats";

const AgentDashboard = () => {
  return (
    <div className="page" id="agent-dashboard">
      <div className="flex flex-col gap-4">{<AgentStats />}</div>
    </div>
  );
};

export default AgentDashboard;
