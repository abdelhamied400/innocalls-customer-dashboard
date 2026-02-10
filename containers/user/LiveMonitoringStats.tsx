"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import StatsCard from "@/components/StatsCard";

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
    previousValue: Math.floor(Math.random() * 30) + 55,
    label: "Answer Rate",
    unit: "%",
    target: 85,
    color: "green" as const,
  },
  averageWaitTime: {
    value: Math.floor(Math.random() * 60) + 20,
    previousValue: Math.floor(Math.random() * 60) + 25,
    label: "Average Wait Time",
    unit: "s",
    target: 45,
    color: "yellow" as const,
  },
  averageTalkTime: {
    value: Math.floor(Math.random() * 300) + 180,
    previousValue: Math.floor(Math.random() * 300) + 200,
    label: "Average Talk Time",
    unit: "s",
    target: 240,
    color: "blue" as const,
  },
  slaCompliance: Math.floor(Math.random() * 10) + 90,
  previousSlaCompliance: Math.floor(Math.random() * 10) + 85,
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
    "Kamal",
    "Donia Mahmoud",
    "A. Abdullah",
    "A. Galal",
    "Goda",
    "Mohammad Salem",
    "abdelhamied",
    "aml",
    "Ali Saleh",
    "amirakamel",
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

const LiveMonitoringStats = () => {
  const t = useTranslations("dashboard.containers");
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<{
    [key: string]: boolean;
  }>({
    online: false,
    busy: false,
    break: false,
    offline: false,
  });
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

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(
        4,
        7,
      )}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "ringing":
        return "bg-blue-500";
      case "on-hold":
        return "bg-yellow-500";
      case "transferring":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "on-call":
        return "bg-blue-100 text-blue-800";
      case "busy":
        return "bg-orange-100 text-orange-800";
      case "break":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="live-monitoring-stats">
      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Calls Overview */}
          <div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>

              {/* Header with Live Calls Summary */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Live Calls
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Real-time call monitoring and management
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {/* Live Calls Metric */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-500">
                      {data.metrics.liveCalls.value}
                    </div>
                    <div className="text-sm text-gray-600">Active Calls</div>
                    <div className="text-xs text-blue-600 font-medium">
                      +
                      {(
                        ((data.metrics.liveCalls.value -
                          data.metrics.liveCalls.previousValue) /
                          data.metrics.liveCalls.previousValue) *
                        100
                      ).toFixed(1)}
                      % vs previous
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Call Details Grid */}
              {data.calls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.calls.map((call) => (
                    <div
                      key={call.callId}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200 group hover:border-primary-500"
                    >
                      {/* Call Information */}
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">
                              📞 From
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPhoneNumber(call.callerNumber)}
                          </p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-500">📱 To</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPhoneNumber(call.recipientNumber)}
                          </p>
                        </div>
                      </div>

                      {/* Call Duration */}
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Duration</span>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-green-600">
                              {formatTime(call.duration || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-blue-400">📞</span>
                  </div>
                  <h4 className="text-xl font-medium text-gray-900 mb-2">
                    No Active Calls
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    There are currently no active calls in the system
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Waiting for calls...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 hidden group-hover:block transition-all duration-200 z-10" />
              <StatsCard
                icon={
                  <img
                    src="/assets/icons/stats/timer.svg"
                    alt="Answer Rate Icon"
                  />
                }
                title="Answer Rate"
                value={`${data.performance.answerRate.value}%`}
                info={
                  <p className="text-sm text-green-600">
                    {data.performance.answerRate.previousValue > 0
                      ? `${
                          ((data.performance.answerRate.value -
                            data.performance.answerRate.previousValue) /
                            data.performance.answerRate.previousValue) *
                            100 >
                          0
                            ? "+"
                            : ""
                        }${(
                          ((data.performance.answerRate.value -
                            data.performance.answerRate.previousValue) /
                            data.performance.answerRate.previousValue) *
                          100
                        ).toFixed(1)}% vs previous`
                      : "No previous data"}
                  </p>
                }
                isRefetching={isLoading}
                className="shadow-none"
              />
            </div>
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 hidden group-hover:block transition-all duration-200 z-10" />
              <StatsCard
                icon={
                  <img
                    src="/assets/icons/stats/hourglass.svg"
                    alt="Average Wait Time Icon"
                  />
                }
                title="Avg Wait Time"
                value={`${data.performance.averageWaitTime.value}s`}
                info={
                  <p className="text-sm text-yellow-600">
                    {data.performance.averageWaitTime.previousValue > 0
                      ? `${
                          ((data.performance.averageWaitTime.value -
                            data.performance.averageWaitTime.previousValue) /
                            data.performance.averageWaitTime.previousValue) *
                            100 >
                          0
                            ? "+"
                            : ""
                        }${(
                          ((data.performance.averageWaitTime.value -
                            data.performance.averageWaitTime.previousValue) /
                            data.performance.averageWaitTime.previousValue) *
                          100
                        ).toFixed(1)}% vs previous`
                      : "No previous data"}
                  </p>
                }
                isRefetching={isLoading}
                className="shadow-none"
              />
            </div>
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 hidden group-hover:block transition-all duration-200 z-10" />
              <StatsCard
                icon={
                  <img
                    src="/assets/icons/stats/timer.svg"
                    alt="Average Talk Time Icon"
                  />
                }
                title="Avg Talk Time"
                value={formatTime(
                  data.performance.averageTalkTime?.value || 240,
                )}
                info={
                  <p className="text-sm text-purple-600">
                    {data.performance.averageTalkTime?.previousValue &&
                    data.performance.averageTalkTime.previousValue > 0
                      ? `${
                          ((data.performance.averageTalkTime.value -
                            data.performance.averageTalkTime.previousValue) /
                            data.performance.averageTalkTime.previousValue) *
                            100 >
                          0
                            ? "+"
                            : ""
                        }${(
                          ((data.performance.averageTalkTime.value -
                            data.performance.averageTalkTime.previousValue) /
                            data.performance.averageTalkTime.previousValue) *
                          100
                        ).toFixed(1)}% vs previous`
                      : "No previous data"}
                  </p>
                }
                isRefetching={isLoading}
                className="shadow-none"
              />
            </div>
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400 hidden group-hover:block transition-all duration-200 z-10" />
              <StatsCard
                icon={
                  <img src="/assets/icons/stats/phone.svg" alt="SLA Icon" />
                }
                title="SLA Compliance"
                value={`${data.performance.slaCompliance || 95}%`}
                info={
                  <p className="text-sm text-blue-600">
                    {data.performance.previousSlaCompliance &&
                    data.performance.previousSlaCompliance > 0
                      ? `${
                          (((data.performance.slaCompliance || 95) -
                            data.performance.previousSlaCompliance) /
                            data.performance.previousSlaCompliance) *
                            100 >
                          0
                            ? "+"
                            : ""
                        }${(
                          (((data.performance.slaCompliance || 95) -
                            data.performance.previousSlaCompliance) /
                            data.performance.previousSlaCompliance) *
                          100
                        ).toFixed(1)}% vs previous`
                      : "No previous data"}
                  </p>
                }
                isRefetching={isLoading}
                className="shadow-none"
              />
            </div>
          </div>

          {/* Queue Overview */}
          <div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Queue Management
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Real-time queue monitoring and management
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      Total Active
                    </div>
                    <div className="text-2xl font-bold text-primary-500">
                      {Object.values(
                        data.queues as Record<
                          string,
                          { inProgressCalls: any[]; waitingCalls: any[] }
                        >,
                      ).reduce(
                        (total, queue) =>
                          total +
                          queue.inProgressCalls.length +
                          queue.waitingCalls.length,
                        0,
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">🔄</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(data.queues).map(
                  ([queueType, queue]: [string, any]) => (
                    <div
                      key={queueType}
                      className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 group"
                    >
                      {/* Queue Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <span className="text-lg group-hover:text-white transition-colors">
                              {queueType === "Support"
                                ? "🛠️"
                                : queueType === "Sales"
                                  ? "💰"
                                  : queueType === "Technical"
                                    ? "⚙️"
                                    : queueType === "Billing"
                                      ? "💳"
                                      : "📞"}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary-500 transition-colors">
                              {queueType}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {queue.inProgressCalls.length +
                                queue.waitingCalls.length}{" "}
                              active calls
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              queue.serviceLevel >= 90
                                ? "text-green-600"
                                : queue.serviceLevel >= 80
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {queue.serviceLevel.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">SLA</div>
                        </div>
                      </div>

                      {/* Queue Statistics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-600">
                              In Progress
                            </span>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {queue.inProgressCalls.length}
                          </div>
                          <div className="text-xs text-gray-500">calls</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-600">
                              Waiting
                            </span>
                          </div>
                          <div className="text-xl font-bold text-orange-600">
                            {queue.waitingCalls.length}
                          </div>
                          <div className="text-xs text-gray-500">calls</div>
                        </div>
                      </div>

                      {/* Call Details */}
                      <div className="space-y-4">
                        {/* Active Calls Section */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            Active Calls ({queue.inProgressCalls.length})
                          </h5>
                          {queue.inProgressCalls.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {queue.inProgressCalls.map((call: any) => (
                                <div
                                  key={call.callId}
                                  className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200 hover:border-primary-500 transition-all duration-200 group"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {formatPhoneNumber(call.callerNumber)}
                                      </p>
                                    </div>
                                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                                      {formatTime(call.talkTime || 0)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600">
                                        Agent:
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {call.agentId}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600">
                                        Status:
                                      </span>
                                      <span className="font-medium text-green-600">
                                        Active
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-2 pt-2 border-t border-green-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-600">
                                        Call Duration
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium text-green-600">
                                          Live
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-gray-400 text-sm">
                                  📞
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                No active calls
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Waiting Calls Section */}
                        <div>
                          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                            Waiting Queue ({queue.waitingCalls.length})
                          </h5>
                          {queue.waitingCalls.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {queue.waitingCalls.map(
                                (call: any, index: number) => (
                                  <div
                                    key={call.callId}
                                    className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200 hover:border-primary-500 transition-all duration-200 group"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                          {index + 1}
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                          {formatPhoneNumber(call.callerNumber)}
                                        </p>
                                      </div>
                                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-medium">
                                        {formatTime(call.waitTime || 0)}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-600">
                                          Position:
                                        </span>
                                        <span className="font-medium text-gray-900">
                                          #{index + 1}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <span className="text-gray-600">
                                          Status:
                                        </span>
                                        <span className="font-medium text-orange-600">
                                          Waiting
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-orange-200">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">
                                          Wait Time
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                          <span className="text-xs font-medium text-orange-600">
                                            In Queue
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-gray-400 text-sm">
                                  ⏳
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">
                                No calls waiting
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Combined Empty State */}
                        {queue.inProgressCalls.length === 0 &&
                          queue.waitingCalls.length === 0 && (
                            <div className="text-center py-6">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl text-gray-400">
                                  📞
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                No calls in {queueType} queue
                              </p>
                            </div>
                          )}
                      </div>

                      {/* Queue Performance */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-600">Avg Wait:</span>
                            <div className="font-medium text-gray-900">
                              {formatTime(queue.statistics.averageWaitTime)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Talk:</span>
                            <div className="font-medium text-gray-900">
                              {formatTime(queue.statistics.averageTalkTime)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Answered:</span>
                            <div className="font-medium text-green-600">
                              {queue.statistics.answeredCalls}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Abandoned:</span>
                            <div className="font-medium text-red-600">
                              {queue.statistics.abandonedCalls}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Agents Sidebar */}
        <div className="lg:col-span-3 sticky top-0 h-[80vh] flex flex-col">
          <div className="bg-white p-6 pb-8 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-400"></div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Agents</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Live status & performance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Total</div>
                  <div className="text-xl font-bold text-primary-500">
                    {data.agents.length}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-lg">👥</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto flex-1 pb-8">
              {/* Online Agents */}
              {data.agents.filter((agent) => agent.status === "online").length >
                0 && (
                <div>
                  <div
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleSection("online")}
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      Online (
                      {
                        data.agents.filter((agent) => agent.status === "online")
                          .length
                      }
                      )
                    </h4>
                    <div
                      className={`transform transition-transform duration-200 ${
                        collapsedSections.online ? "rotate-180" : ""
                      }`}
                    >
                      <span className="text-gray-500">▼</span>
                    </div>
                  </div>
                  {!collapsedSections.online && (
                    <div className="space-y-2">
                      {data.agents
                        .filter((agent) => agent.status === "online")
                        .map((agent) => (
                          <div
                            key={agent.agentId}
                            className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-2 hover:shadow-md transition-all duration-200 group hover:border-primary-500"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                <span className="text-xs group-hover:text-white transition-colors">
                                  {agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">
                                  {agent.name}
                                </h4>
                                <p className="text-[10px] text-gray-600">
                                  Ext: {agent.extension}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Calls</span>
                                <span className="font-semibold text-gray-900">
                                  {agent.totalCallsToday}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Time</span>
                                <span className="font-semibold text-gray-900">
                                  {formatTime(agent.averageHandleTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Busy Agents */}
              {data.agents.filter((agent) => agent.status === "busy").length >
                0 && (
                <div>
                  <div
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleSection("busy")}
                  >
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      On Call (
                      {
                        data.agents.filter((agent) => agent.status === "busy")
                          .length
                      }
                      )
                    </h4>
                    <div
                      className={`transform transition-transform duration-200 ${
                        collapsedSections.busy ? "rotate-180" : ""
                      }`}
                    >
                      <span className="text-gray-500">▼</span>
                    </div>
                  </div>
                  {!collapsedSections.busy && (
                    <div className="space-y-2">
                      {data.agents
                        .filter((agent) => agent.status === "busy")
                        .map((agent) => (
                          <div
                            key={agent.agentId}
                            className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-2 hover:shadow-md transition-all duration-200 group hover:border-primary-500"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                <span className="text-xs group-hover:text-white transition-colors">
                                  {agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">
                                  {agent.name}
                                </h4>
                                <p className="text-[10px] text-gray-600">
                                  Ext: {agent.extension}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Calls</span>
                                <span className="font-semibold text-gray-900">
                                  {agent.totalCallsToday}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Time</span>
                                <span className="font-semibold text-gray-900">
                                  {formatTime(agent.averageHandleTime)}
                                </span>
                              </div>
                            </div>

                            {agent.currentCall && (
                              <div className="mt-2 pt-2 border-t border-orange-200">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600">
                                    Current Call
                                  </span>
                                  <span className="font-medium text-blue-600">
                                    {agent.currentCall.slice(-8)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Break Agents */}
              {data.agents.filter((agent) => agent.status === "break").length >
                0 && (
                <div>
                  <div
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleSection("break")}
                  >
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      On Break (
                      {
                        data.agents.filter((agent) => agent.status === "break")
                          .length
                      }
                      )
                    </h4>
                    <div
                      className={`transform transition-transform duration-200 ${
                        collapsedSections.break ? "rotate-180" : ""
                      }`}
                    >
                      <span className="text-gray-500">▼</span>
                    </div>
                  </div>
                  {!collapsedSections.break && (
                    <div className="space-y-2">
                      {data.agents
                        .filter((agent) => agent.status === "break")
                        .map((agent) => (
                          <div
                            key={agent.agentId}
                            className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-2 hover:shadow-md transition-all duration-200 group hover:border-primary-500"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                <span className="text-xs group-hover:text-white transition-colors">
                                  {agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">
                                  {agent.name}
                                </h4>
                                <p className="text-[10px] text-gray-600">
                                  Ext: {agent.extension}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Calls</span>
                                <span className="font-semibold text-gray-900">
                                  {agent.totalCallsToday}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Time</span>
                                <span className="font-semibold text-gray-900">
                                  {formatTime(agent.averageHandleTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Offline Agents */}
              {data.agents.filter((agent) => agent.status === "offline")
                .length > 0 && (
                <div>
                  <div
                    className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    onClick={() => toggleSection("offline")}
                  >
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <h4 className="text-sm font-semibold text-gray-900 flex-1">
                      Offline (
                      {
                        data.agents.filter(
                          (agent) => agent.status === "offline",
                        ).length
                      }
                      )
                    </h4>
                    <div
                      className={`transform transition-transform duration-200 ${
                        collapsedSections.offline ? "rotate-180" : ""
                      }`}
                    >
                      <span className="text-gray-500">▼</span>
                    </div>
                  </div>
                  {!collapsedSections.offline && (
                    <div className="space-y-2">
                      {data.agents
                        .filter((agent) => agent.status === "offline")
                        .map((agent) => (
                          <div
                            key={agent.agentId}
                            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-2 hover:shadow-md transition-all duration-200 group hover:border-primary-500 opacity-75"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                <span className="text-xs group-hover:text-white transition-colors">
                                  {agent.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-gray-900 group-hover:text-primary-500 transition-colors truncate">
                                  {agent.name}
                                </h4>
                                <p className="text-[10px] text-gray-600">
                                  Ext: {agent.extension}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[10px]">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Calls</span>
                                <span className="font-semibold text-gray-900">
                                  {agent.totalCallsToday}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Avg Time</span>
                                <span className="font-semibold text-gray-900">
                                  {formatTime(agent.averageHandleTime)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoringStats;
