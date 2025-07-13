// Metric Card Interfaces
export interface MetricCardProps {
  value: number;
  previousValue: number;
  label: string;
  icon: React.ReactNode;
  colorTheme: 'green' | 'red' | 'blue' | 'neutral';
  unit?: string;
  isLoading?: boolean;
}

export interface MetricData {
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  trendDirection: 'up' | 'down' | 'stable';
  timestamp: Date;
  colorCode: 'green' | 'yellow' | 'red';
  label: string;
  unit?: string;
}

export interface RealTimeMetrics {
  onlineUsers: MetricData;
  offlineUsers: MetricData;
  liveCalls: MetricData;
  totalAgents: MetricData;
  lastUpdate: Date;
}

// Call Details Interfaces
export type CallStatus = 'ringing' | 'connected' | 'on-hold' | 'transferring' | 'ended' | 'abandoned';

export interface CallDetails {
  callId: string;
  callerNumber: string;
  recipientNumber: string;
  startTime: Date;
  duration: number; // in seconds
  status: CallStatus;
  queueType: string;
  agentAssigned?: string;
  agentId?: string;
  waitTime: number; // in seconds
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  callbackRequested: boolean;
  slaBreach: boolean;
  slaThreshold: number; // in seconds
  notes?: string;
  tags?: string[];
}

export interface LiveCallCardProps {
  call: CallDetails;
  isLoading?: boolean;
}

export interface LiveCallDetailsProps {
  calls: CallDetails[];
  isLoading?: boolean;
}

// Performance Metrics Interfaces
export interface PerformanceMetric {
  value: number;
  label: string;
  unit: string;
  target?: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
  icon?: React.ReactNode;
}

export interface PerformanceMetricsProps {
  answerRate: PerformanceMetric;
  averageWaitTime: PerformanceMetric;
  isLoading?: boolean;
}

// Queue Management Interfaces
export type QueueType = 'Support' | 'Sales' | 'Technical' | 'Billing' | 'General';

export interface QueueCall {
  callId: string;
  callerNumber: string;
  agentId?: string;
  talkTime?: number; // in seconds
  waitTime?: number; // in seconds
  status: 'in-progress' | 'waiting';
}

export interface QueueStatistics {
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
}

export interface QueueState {
  queueType: QueueType;
  waitingCalls: QueueCall[];
  inProgressCalls: QueueCall[];
  statistics: QueueStatistics;
  slaThreshold: number;
  maxQueueSize: number;
  currentQueueSize: number;
  averageHandleTime: number;
  serviceLevel: number;
}

export interface QueueOverviewProps {
  queues: Record<QueueType, QueueState>;
  isLoading?: boolean;
}

export interface QueueStatisticsProps {
  statistics: QueueStatistics;
  isLoading?: boolean;
}

// Agent Management Interfaces
export type AgentStatus = 'online' | 'offline' | 'busy' | 'break' | 'training' | 'unavailable' | 'on-call';

export interface AgentDetails {
  agentId: string;
  name: string;
  status: AgentStatus;
  queueType: QueueType;
  extension: string;
  avatar?: string;
  currentCall?: string;
  totalCallsToday: number;
  averageHandleTime: number;
  lastActivity: Date;
  skills: string[];
  availability: boolean;
}

export interface AgentCardProps {
  agent: AgentDetails;
  isLoading?: boolean;
}

export interface AgentManagementProps {
  agents: AgentDetails[];
  isLoading?: boolean;
}

// Common Interfaces
export interface LoadingSkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export interface StatusIndicatorProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

// Utility Types
export type ColorTheme = 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'purple' | 'orange';

export interface TrendIndicatorProps {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  className?: string;
} 