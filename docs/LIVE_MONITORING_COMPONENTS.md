# Live Monitoring Components Documentation

This document provides comprehensive documentation for all the live monitoring components in the Supercell contact center system.

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
   - [MetricsCards](#metricscards)
   - [LiveCallDetails](#livecalldetails)
   - [PerformanceMetrics](#performancemetrics)
   - [QueueOverview](#queueoverview)
   - [QueueStatistics](#queuestatistics)
   - [AgentManagement](#agentmanagement)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Integration Guide](#integration-guide)
5. [Styling and Theming](#styling-and-theming)
6. [Performance Considerations](#performance-considerations)

## Overview

The live monitoring system consists of six main components that provide real-time insights into call center operations:

- **MetricsCards**: Top-level KPI cards with trend indicators
- **LiveCallDetails**: Real-time call monitoring with status indicators
- **PerformanceMetrics**: Key performance indicators with animations
- **QueueOverview**: Comprehensive queue management interface
- **QueueStatistics**: Detailed queue performance metrics
- **AgentManagement**: Agent status and performance tracking

## Components

### MetricsCards

Displays four key metrics in a responsive grid layout with trend indicators and color coding.

#### Props

```typescript
interface MetricsCardsProps {
  metrics: {
    onlineUsers: { value: number; previousValue: number };
    offlineUsers: { value: number; previousValue: number };
    liveCalls: { value: number; previousValue: number };
    totalAgents: { value: number; previousValue: number };
  };
  isLoading?: boolean;
}
```

#### Usage

```tsx
import MetricsCards from '@/components/LiveMonitoring/MetricsCards';

const metrics = {
  onlineUsers: { value: 45, previousValue: 42 },
  offlineUsers: { value: 8, previousValue: 12 },
  liveCalls: { value: 12, previousValue: 8 },
  totalAgents: { value: 25, previousValue: 25 }
};

<MetricsCards metrics={metrics} isLoading={false} />
```

#### Features

- **Responsive Design**: Adapts to different screen sizes
- **Trend Indicators**: Shows percentage change with up/down arrows
- **Color Coding**: Green for positive, red for negative, blue for neutral
- **Loading States**: Skeleton loading animations
- **Hover Effects**: Smooth transitions and scaling on hover

### LiveCallDetails

Shows real-time call information with caller/recipient details and status indicators.

#### Props

```typescript
interface LiveCallDetailsProps {
  calls: CallDetails[];
  isLoading?: boolean;
}
```

#### Usage

```tsx
import LiveCallDetails from '@/components/LiveMonitoring/LiveCallDetails';

const calls = [
  {
    callId: 'call-123',
    callerNumber: '+1 (555) 123-4567',
    recipientNumber: '+1 (800) 123-4567',
    status: 'connected',
    // ... other properties
  }
];

<LiveCallDetails calls={calls} isLoading={false} />
```

#### Features

- **Status Indicators**: Color-coded status dots with animations
- **Phone Number Formatting**: Automatic formatting for display
- **Empty States**: Handles no active calls gracefully
- **Responsive Grid**: Stacks on mobile devices
- **Real-time Updates**: Supports live data updates

### PerformanceMetrics

Displays key performance indicators with smooth number animations and target indicators.

#### Props

```typescript
interface PerformanceMetricsProps {
  answerRate: PerformanceMetric;
  averageWaitTime: PerformanceMetric;
  isLoading?: boolean;
}

interface PerformanceMetric {
  value: number;
  label: string;
  unit: string;
  target?: number;
  color: 'green' | 'yellow' | 'red' | 'blue';
  icon?: React.ReactNode;
}
```

#### Usage

```tsx
import PerformanceMetrics from '@/components/LiveMonitoring/PerformanceMetrics';

const performance = {
  answerRate: {
    value: 85,
    label: 'Answer Rate',
    unit: '%',
    target: 90,
    color: 'green'
  },
  averageWaitTime: {
    value: 45,
    label: 'Average Wait Time',
    unit: 's',
    target: 60,
    color: 'yellow'
  }
};

<PerformanceMetrics {...performance} isLoading={false} />
```

#### Features

- **Smooth Animations**: Number counting animations
- **Target Indicators**: Shows performance against targets
- **Color Coding**: Based on performance thresholds
- **Progress Bars**: Visual representation of target achievement
- **Icon Support**: Custom icons for each metric

### QueueOverview

Comprehensive queue management interface with collapsible sections for different queue types.

#### Props

```typescript
interface QueueOverviewProps {
  queues: Record<QueueType, QueueState>;
  isLoading?: boolean;
}
```

#### Usage

```tsx
import QueueOverview from '@/components/LiveMonitoring/QueueOverview';

const queues = {
  Support: {
    queueType: 'Support',
    waitingCalls: [...],
    inProgressCalls: [...],
    statistics: {...},
    // ... other properties
  },
  Sales: {
    // ... similar structure
  }
};

<QueueOverview queues={queues} isLoading={false} />
```

#### Features

- **Collapsible Sections**: Expandable queue sections
- **Call Cards**: Individual call information display
- **Queue Statistics**: Built-in statistics for each queue
- **Status Indicators**: Color-coded call status
- **Empty States**: Handles queues with no calls

### QueueStatistics

Displays detailed queue performance metrics with SLA compliance tracking.

#### Props

```typescript
interface QueueStatisticsProps {
  statistics: QueueStatistics;
  isLoading?: boolean;
}
```

#### Usage

```tsx
import QueueStatistics from '@/components/LiveMonitoring/QueueStatistics';

const statistics = {
  maxWaitTime: 300,
  minWaitTime: 30,
  maxTalkTime: 1800,
  minTalkTime: 120,
  averageWaitTime: 90,
  averageTalkTime: 450,
  totalCalls: 150,
  answeredCalls: 135,
  abandonedCalls: 15,
  slaBreaches: 5,
  slaComplianceRate: 96.7
};

<QueueStatistics statistics={statistics} isLoading={false} />
```

#### Features

- **Time Formatting**: HH:MM:SS format for time values
- **SLA Thresholds**: Color coding based on SLA compliance
- **Progress Bars**: Visual representation of performance
- **Comparison Indicators**: Better/worse than targets
- **Additional Metrics**: Average times and abandoned calls

### AgentManagement

Comprehensive agent management interface with filtering, search, and status tracking.

#### Props

```typescript
interface AgentManagementProps {
  agents: AgentDetails[];
  isLoading?: boolean;
}
```

#### Usage

```tsx
import AgentManagement from '@/components/LiveMonitoring/AgentManagement';

const agents = [
  {
    agentId: 'agent-1',
    name: 'Ahmed Rabiea',
    status: 'online',
    queueType: 'Support',
    extension: '101',
    // ... other properties
  }
];

<AgentManagement agents={agents} isLoading={false} />
```

#### Features

- **Tab Navigation**: Filter by agent status
- **Search Functionality**: Search by name, extension, or queue
- **Status Indicators**: Color-coded status badges
- **Agent Cards**: Detailed agent information
- **Responsive Grid**: Adapts to different screen sizes

## TypeScript Interfaces

All components use comprehensive TypeScript interfaces for type safety:

```typescript
// Core interfaces
export interface CallDetails {
  callId: string;
  callerNumber: string;
  recipientNumber: string;
  startTime: Date;
  duration: number;
  status: CallStatus;
  // ... other properties
}

export interface AgentDetails {
  agentId: string;
  name: string;
  status: AgentStatus;
  queueType: QueueType;
  // ... other properties
}

export interface QueueState {
  queueType: QueueType;
  waitingCalls: QueueCall[];
  inProgressCalls: QueueCall[];
  statistics: QueueStatistics;
  // ... other properties
}
```

## Integration Guide

### Basic Integration

1. **Install Dependencies**: Ensure all required dependencies are installed
2. **Import Components**: Import the components you need
3. **Prepare Data**: Structure your data according to the interfaces
4. **Render Components**: Use the components with proper props

### Real-time Updates

For real-time updates, consider using:

- **WebSocket connections** for live data
- **Polling mechanisms** for periodic updates
- **Event-driven updates** for immediate changes

### Error Handling

All components include:
- **Loading states** for async operations
- **Empty states** for no data scenarios
- **Error boundaries** for graceful failures

## Styling and Theming

### Brand Colors

The components use the Supercell brand color (`#cd1235`) for:
- Active tab indicators
- Primary buttons
- Focus states
- Brand accents

### Responsive Design

All components are fully responsive with:
- **Mobile-first** approach
- **Flexible grids** that adapt to screen size
- **Touch-friendly** interactions
- **Readable typography** at all sizes

### Customization

Components can be customized through:
- **CSS classes** for styling overrides
- **Props** for functional customization
- **Theme variables** for consistent theming

## Performance Considerations

### Optimization Tips

1. **Memoization**: Use React.memo for expensive components
2. **Virtualization**: For large lists of agents or calls
3. **Debouncing**: For search inputs and real-time updates
4. **Lazy Loading**: For components not immediately visible

### Bundle Size

- **Tree shaking** supported for unused components
- **Code splitting** recommended for large applications
- **Dynamic imports** for conditional component loading

### Real-time Performance

- **Efficient re-renders** with proper key props
- **Optimized animations** using CSS transforms
- **Background updates** to avoid UI blocking

## Examples

### Complete Dashboard Example

```tsx
import React, { useState, useEffect } from 'react';
import MetricsCards from '@/components/LiveMonitoring/MetricsCards';
import LiveCallDetails from '@/components/LiveMonitoring/LiveCallDetails';
import PerformanceMetrics from '@/components/LiveMonitoring/PerformanceMetrics';
import QueueOverview from '@/components/LiveMonitoring/QueueOverview';
import AgentManagement from '@/components/LiveMonitoring/AgentManagement';

const LiveMonitoringDashboard: React.FC = () => {
  const [data, setData] = useState({
    metrics: { /* ... */ },
    calls: [],
    performance: { /* ... */ },
    queues: { /* ... */ },
    agents: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch data and update state
  }, []);

  return (
    <div className="space-y-6">
      <MetricsCards metrics={data.metrics} isLoading={isLoading} />
      <LiveCallDetails calls={data.calls} isLoading={isLoading} />
      <PerformanceMetrics {...data.performance} isLoading={isLoading} />
      <QueueOverview queues={data.queues} isLoading={isLoading} />
      <AgentManagement agents={data.agents} isLoading={isLoading} />
    </div>
  );
};
```

### Custom Styling Example

```tsx
// Custom styled metrics card
const CustomMetricsCards = styled(MetricsCards)`
  .metric-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .trend-indicator {
    color: #ffd700;
  }
`;
```

This documentation provides a comprehensive guide to using all the live monitoring components effectively in your Supercell contact center application. 