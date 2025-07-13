"use client";

import React from 'react';
import { MetricCardProps, TrendIndicatorProps } from '@/types/liveMonitoring';

// Trend Indicator Component
const TrendIndicator: React.FC<TrendIndicatorProps> = ({ direction, percentage, className = '' }) => {
  const getTrendIcon = () => {
    switch (direction) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (direction) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()} ${className}`}>
      <span className="text-lg">{getTrendIcon()}</span>
      <span>{Math.abs(percentage).toFixed(1)}%</span>
    </div>
  );
};

// Loading Skeleton Component
const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-20 h-8 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Individual Metric Card Component
const MetricCard: React.FC<MetricCardProps> = ({
  value,
  previousValue,
  label,
  icon,
  colorTheme,
  unit,
  isLoading = false
}) => {
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  const percentageChange = previousValue === 0 
    ? (value > 0 ? 100 : 0)
    : ((value - previousValue) / previousValue) * 100;

  const trendDirection: 'up' | 'down' | 'stable' = 
    Math.abs(percentageChange) < 1 ? 'stable' : percentageChange > 0 ? 'up' : 'down';

  const getColorClasses = () => {
    switch (colorTheme) {
      case 'green':
        return {
          card: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
          icon: 'bg-green-500 text-white',
          value: 'text-green-700',
          label: 'text-green-600'
        };
      case 'red':
        return {
          card: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
          icon: 'bg-red-500 text-white',
          value: 'text-red-700',
          label: 'text-red-600'
        };
      case 'blue':
        return {
          card: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
          icon: 'bg-blue-500 text-white',
          value: 'text-blue-700',
          label: 'text-blue-600'
        };
      default:
        return {
          card: 'bg-white border-gray-200',
          icon: 'bg-gray-500 text-white',
          value: 'text-gray-700',
          label: 'text-gray-600'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`p-6 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 ${colors.card}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.icon}`}>
          {icon}
        </div>
        <TrendIndicator 
          direction={trendDirection} 
          percentage={percentageChange}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${colors.value}`}>
            {value.toLocaleString()}
          </span>
          {unit && (
            <span className={`text-sm ${colors.label}`}>
              {unit}
            </span>
          )}
        </div>
        <p className={`text-sm font-medium ${colors.label}`}>
          {label}
        </p>
      </div>
    </div>
  );
};

// Main Metrics Cards Component
interface MetricsCardsProps {
  metrics: {
    onlineUsers: { value: number; previousValue: number };
    offlineUsers: { value: number; previousValue: number };
    liveCalls: { value: number; previousValue: number };
    totalAgents: { value: number; previousValue: number };
  };
  isLoading?: boolean;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics, isLoading = false }) => {
  const metricCards = [
    {
      key: 'onlineUsers',
      label: 'Online Users',
      icon: <span className="text-lg">👥</span>,
      colorTheme: 'green' as const,
      unit: 'users'
    },
    {
      key: 'offlineUsers',
      label: 'Offline Users',
      icon: <span className="text-lg">🚫</span>,
      colorTheme: 'red' as const,
      unit: 'users'
    },
    {
      key: 'liveCalls',
      label: 'Live Calls',
      icon: <span className="text-lg">📞</span>,
      colorTheme: 'blue' as const,
      unit: 'calls'
    },
    {
      key: 'totalAgents',
      label: 'Total Agents',
      icon: <span className="text-lg">👨‍💼</span>,
      colorTheme: 'neutral' as const,
      unit: 'agents'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => (
        <MetricCard
          key={card.key}
          value={metrics[card.key as keyof typeof metrics].value}
          previousValue={metrics[card.key as keyof typeof metrics].previousValue}
          label={card.label}
          icon={card.icon}
          colorTheme={card.colorTheme}
          unit={card.unit}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default MetricsCards; 