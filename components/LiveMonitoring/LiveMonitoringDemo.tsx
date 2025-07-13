"use client";

import React, { useState, useEffect } from "react";
import MetricsCards from "./MetricsCards";
import LiveCallDetails from "./LiveCallDetails";
import PerformanceMetrics from "./PerformanceMetrics";
import QueueOverview from "./QueueOverview";
import QueueStatistics from "./QueueStatistics";
// import AgentManagement from './AgentManagement';

// Mock data generators
const generateMockMetrics = () => ({
  onlineUsers: {
    value: Math.floor(Math.random() * 50) + 20,
    previousValue: Math.floor(Math.random() * 50) + 15,
  },
  offlineUsers: {
    value: Math.floor(Math.random() * 20) + 5,
    previousValue: Math.floor(Math.random() * 20) + 3,
  },
  liveCalls: {
    value: Math.floor(Math.random() * 15) + 5,
    previousValue: Math.floor(Math.random() * 15) + 3,
  },
  totalAgents: {
    value: Math.floor(Math.random() * 30) + 15,
    previousValue: Math.floor(Math.random() * 30) + 12,
  },
});

const generateMockCalls = () => {
  const calls = [];
  const statuses: ("ringing" | "connected" | "on-hold" | "transferring")[] = [
    "ringing",
    "connected",
    "on-hold",
    "transferring",
  ];
  const phoneNumbers = [
    "+1 (555) 123-4567",
    "+1 (555) 234-5678",
    "+1 (555) 345-6789",
    "+1 (555) 456-7890",
    "+1 (555) 567-8901",
    "+1 (555) 678-9012",
  ];

  for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {
    calls.push({
      callId: `call-${Date.now()}-${i}`,
      callerNumber:
        phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)],
      recipientNumber: "+1 (800) 123-4567",
      startTime: new Date(Date.now() - Math.random() * 300000),
      duration: Math.floor(Math.random() * 1800) + 60,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      queueType: "Support",
      waitTime: Math.floor(Math.random() * 300) + 30,
      priorityLevel: "medium" as const,
      callbackRequested: false,
      slaBreach: false,
      slaThreshold: 300,
    });
  }
  return calls;
};

const generateMockPerformanceMetrics = () => ({
  answerRate: {
    value: Math.floor(Math.random() * 30) + 60,
    label: "Answer Rate",
    unit: "%",
    target: 85,
    color: "green" as const,
  },
  averageWaitTime: {
    value: Math.floor(Math.random() * 60) + 20,
    label: "Average Wait Time",
    unit: "s",
    target: 45,
    color: "yellow" as const,
  },
});

const generateMockQueues = () => {
  const queueTypes = ["Support", "Sales", "Technical", "Billing", "General"];
  const queues: any = {};

  queueTypes.forEach((type) => {
    const inProgressCalls = Math.floor(Math.random() * 3);
    const waitingCalls = Math.floor(Math.random() * 5);

    queues[type] = {
      queueType: type,
      waitingCalls: Array.from({ length: waitingCalls }, (_, i) => ({
        callId: `waiting-${type}-${i}`,
        callerNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        waitTime: Math.floor(Math.random() * 600) + 60,
        status: "waiting" as const,
      })),
      inProgressCalls: Array.from({ length: inProgressCalls }, (_, i) => ({
        callId: `progress-${type}-${i}`,
        callerNumber: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${
          Math.floor(Math.random() * 9000) + 1000
        }`,
        agentId: `Agent-${Math.floor(Math.random() * 20) + 1}`,
        talkTime: Math.floor(Math.random() * 1800) + 120,
        status: "in-progress" as const,
      })),
      statistics: {
        maxWaitTime: Math.floor(Math.random() * 600) + 120,
        minWaitTime: Math.floor(Math.random() * 60) + 30,
        maxTalkTime: Math.floor(Math.random() * 1800) + 600,
        minTalkTime: Math.floor(Math.random() * 300) + 120,
        averageWaitTime: Math.floor(Math.random() * 300) + 90,
        averageTalkTime: Math.floor(Math.random() * 900) + 300,
        totalCalls: Math.floor(Math.random() * 100) + 50,
        answeredCalls: Math.floor(Math.random() * 80) + 40,
        abandonedCalls: Math.floor(Math.random() * 20) + 5,
        slaBreaches: Math.floor(Math.random() * 10) + 2,
        slaComplianceRate: Math.floor(Math.random() * 20) + 80,
      },
      slaThreshold: 300,
      maxQueueSize: 50,
      currentQueueSize: waitingCalls + inProgressCalls,
      averageHandleTime: Math.floor(Math.random() * 600) + 300,
      serviceLevel: Math.floor(Math.random() * 20) + 80,
    };
  });

  return queues;
};

const generateMockAgents = () => {
  const names = [
    "Ahmed Rabiea",
    "Shaimaa	",
    "Mike Davis",
    "Emily Wilson",
    "A. Abdullah",
    "A. Galal",
    "Goda",
    "Maria Garcia",
    "Robert Martinez",
    "Jennifer Lee",
    "Christopher White",
    "Amanda Clark",
  ];
  const statuses = [
    "online",
    "on-call",
    "busy",
    "break",
    "offline",
    "training",
  ];
  const queueTypes = ["Support", "Sales", "Technical", "Billing", "General"];

  return names.map((name, index) => ({
    agentId: `agent-${index + 1}`,
    name,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    queueType: queueTypes[Math.floor(Math.random() * queueTypes.length)] as any,
    extension: `${Math.floor(Math.random() * 900) + 100}`,
    currentCall:
      Math.random() > 0.7
        ? `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${
            Math.floor(Math.random() * 9000) + 1000
          }`
        : undefined,
    totalCallsToday: Math.floor(Math.random() * 50) + 10,
    averageHandleTime: Math.floor(Math.random() * 600) + 180,
    lastActivity: new Date(Date.now() - Math.random() * 3600000),
    skills: ["Customer Service", "Technical Support"],
    availability: Math.random() > 0.3,
  }));
};

const LiveMonitoringDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    metrics: generateMockMetrics(),
    calls: generateMockCalls(),
    performance: generateMockPerformanceMetrics(),
    queues: generateMockQueues(),
    agents: generateMockAgents(),
  });

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData({
        metrics: generateMockMetrics(),
        calls: generateMockCalls(),
        performance: generateMockPerformanceMetrics(),
        queues: generateMockQueues(),
        agents: generateMockAgents(),
      });
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "calls", label: "Live Calls", icon: "📞" },
    { id: "performance", label: "Performance", icon: "⚡" },
    { id: "queues", label: "Queue Management", icon: "🔄" },
    { id: "statistics", label: "Statistics", icon: "📈" },
    { id: "agents", label: "Agents", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Live Monitoring Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-500/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-500"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <MetricsCards metrics={data.metrics} isLoading={isLoading} />
            <LiveCallDetails calls={data.calls} isLoading={isLoading} />
            <PerformanceMetrics {...data.performance} isLoading={isLoading} />
          </div>
        )}

        {activeTab === "calls" && (
          <LiveCallDetails calls={data.calls} isLoading={isLoading} />
        )}

        {activeTab === "performance" && (
          <PerformanceMetrics {...data.performance} isLoading={isLoading} />
        )}

        {activeTab === "queues" && (
          <QueueOverview queues={data.queues} isLoading={isLoading} />
        )}

        {activeTab === "statistics" && (
          <QueueStatistics
            statistics={data.queues.Support.statistics}
            isLoading={isLoading}
          />
        )}

        {/* {activeTab === 'agents' && (
          <AgentManagement agents={data.agents} isLoading={isLoading} />
        )} */}
      </div>
    </div>
  );
};

export default LiveMonitoringDemo;
