"use client";

import React, { useState } from "react";
import {
  QueueOverviewProps,
  QueueCall,
  QueueType,
} from "@/types/liveMonitoring";

// Loading Skeleton
const QueueSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
        <div className="w-16 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};

// Call Card Component
interface CallCardProps {
  call: QueueCall;
  type: "in-progress" | "waiting";
}

const CallCard: React.FC<CallCardProps> = ({ call, type }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusColor = () => {
    return type === "in-progress" ? "bg-green-500" : "bg-orange-500";
  };

  const getStatusText = () => {
    return type === "in-progress" ? "In Progress" : "Waiting";
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
          <span className="text-xs font-medium text-gray-600">
            {getStatusText()}
          </span>
        </div>
        {call.talkTime && (
          <span className="text-xs text-gray-500">
            {formatTime(call.talkTime)}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-900">
          {formatPhoneNumber(call.callerNumber)}
        </p>
        {call.agentId && (
          <p className="text-xs text-gray-600">Agent: {call.agentId}</p>
        )}
        {call.waitTime && (
          <p className="text-xs text-gray-600">
            Wait: {formatTime(call.waitTime)}
          </p>
        )}
      </div>
    </div>
  );
};

// Queue Section Component
interface QueueSectionProps {
  queueType: QueueType;
  queue: {
    waitingCalls: QueueCall[];
    inProgressCalls: QueueCall[];
    statistics: {
      maxWaitTime: number;
      minWaitTime: number;
      maxTalkTime: number;
      minTalkTime: number;
      averageWaitTime: number;
      averageTalkTime: number;
      totalCalls: number;
      answeredCalls: number;
      abandonedCalls: number;
      slaBreaches: number;
      slaComplianceRate: number;
    };
    slaThreshold: number;
    maxQueueSize: number;
    currentQueueSize: number;
    averageHandleTime: number;
    serviceLevel: number;
  };
  isLoading?: boolean;
}

const QueueSection: React.FC<QueueSectionProps> = ({
  queueType,
  queue,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (isLoading) {
    return <QueueSkeleton />;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getQueueIcon = () => {
    switch (queueType) {
      case "Support":
        return "🛠️";
      case "Sales":
        return "💰";
      case "Technical":
        return "⚙️";
      case "Billing":
        return "💳";
      default:
        return "📞";
    }
  };

  const getSlaColor = (complianceRate: number) => {
    if (complianceRate >= 90) return "text-green-600";
    if (complianceRate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div
        className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getQueueIcon()}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {queueType} Queue
              </h3>
              <p className="text-sm text-gray-600">
                {queue.inProgressCalls.length} in progress,{" "}
                {queue.waitingCalls.length} waiting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                SLA: {queue.serviceLevel.toFixed(1)}%
              </p>
              <p className={`text-xs ${getSlaColor(queue.serviceLevel)}`}>
                {queue.statistics.slaComplianceRate.toFixed(1)}% compliance
              </p>
            </div>
            <div
              className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
            >
              <span className="text-gray-400">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* In Progress Calls */}
          {queue.inProgressCalls.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                In Progress Calls ({queue.inProgressCalls.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {queue.inProgressCalls.map((call) => (
                  <CallCard key={call.callId} call={call} type="in-progress" />
                ))}
              </div>
            </div>
          )}

          {/* Waiting Calls */}
          {queue.waitingCalls.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Waiting Calls ({queue.waitingCalls.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {queue.waitingCalls.map((call) => (
                  <CallCard key={call.callId} call={call} type="waiting" />
                ))}
              </div>
            </div>
          )}

          {/* Queue Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Queue Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Max Wait</p>
                <p className="font-medium">
                  {formatTime(queue.statistics.maxWaitTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Min Wait</p>
                <p className="font-medium">
                  {formatTime(queue.statistics.minWaitTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Max Talk</p>
                <p className="font-medium">
                  {formatTime(queue.statistics.maxTalkTime)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Min Talk</p>
                <p className="font-medium">
                  {formatTime(queue.statistics.minTalkTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {queue.inProgressCalls.length === 0 &&
            queue.waitingCalls.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl text-gray-400">📞</span>
                </div>
                <p className="text-sm text-gray-600">
                  No active calls in {queueType} queue
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

// Main Queue Overview Component
const QueueOverview: React.FC<QueueOverviewProps> = ({
  queues,
  isLoading = false,
}) => {
  const queueTypes: QueueType[] = [
    "Support",
    "Sales",
    "Technical",
    "Billing",
    "General",
  ];

  return (
    <div className="space-y-6">
      {queueTypes.map((queueType) => {
        const queue = queues[queueType];
        if (!queue) return null;

        return (
          <QueueSection
            key={queueType}
            queueType={queueType}
            queue={queue}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
};

export default QueueOverview;
