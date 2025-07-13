"use client";

import React from 'react';
import { QueueStatisticsProps } from '@/types/liveMonitoring';

// Loading Skeleton
const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
      <div className="w-16 h-6 bg-gray-200 rounded"></div>
    </div>
  );
};

// Individual Stat Card Component
interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  threshold?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, threshold, isLoading = false }) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (!threshold) return 'text-gray-700';
    
    // For wait times, lower is better (green)
    if (label.toLowerCase().includes('wait')) {
      if (value <= threshold * 0.8) return 'text-green-600';
      if (value <= threshold) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    // For talk times, moderate is better
    if (label.toLowerCase().includes('talk')) {
      if (value >= threshold * 0.8 && value <= threshold * 1.2) return 'text-green-600';
      if (value >= threshold * 0.6 && value <= threshold * 1.4) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    return 'text-gray-700';
  };

  const getComparisonIndicator = () => {
    if (!threshold) return null;
    
    const ratio = value / threshold;
    
    if (label.toLowerCase().includes('wait')) {
      if (ratio <= 0.8) return { icon: '↓', color: 'text-green-600', text: 'Good' };
      if (ratio <= 1.0) return { icon: '→', color: 'text-yellow-600', text: 'Acceptable' };
      return { icon: '↑', color: 'text-red-600', text: 'High' };
    }
    
    if (label.toLowerCase().includes('talk')) {
      if (ratio >= 0.8 && ratio <= 1.2) return { icon: '✓', color: 'text-green-600', text: 'Optimal' };
      if (ratio >= 0.6 && ratio <= 1.4) return { icon: '→', color: 'text-yellow-600', text: 'Acceptable' };
      return { icon: '⚠', color: 'text-red-600', text: 'Review' };
    }
    
    return null;
  };

  const comparison = getComparisonIndicator();

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{label}</h4>
        {comparison && (
          <div className={`flex items-center gap-1 text-xs ${comparison.color}`}>
            <span>{comparison.icon}</span>
            <span>{comparison.text}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${getColorClass()}`}>
          {formatTime(value)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      
      {threshold && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Target: {formatTime(threshold)}</span>
            <span>{((value / threshold) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                getColorClass().replace('text-', 'bg-')
              }`}
              style={{ width: `${Math.min((value / threshold) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Queue Statistics Component
const QueueStatistics: React.FC<QueueStatisticsProps> = ({ statistics, isLoading = false }) => {
  const statCards = [
    {
      key: 'maxWait',
      label: 'Max Wait Time',
      value: statistics.maxWaitTime,
      unit: 'sec',
      threshold: 300 // 5 minutes
    },
    {
      key: 'minWait',
      label: 'Min Wait Time',
      value: statistics.minWaitTime,
      unit: 'sec',
      threshold: 60 // 1 minute
    },
    {
      key: 'maxTalk',
      label: 'Max Talk Time',
      value: statistics.maxTalkTime,
      unit: 'sec',
      threshold: 1800 // 30 minutes
    },
    {
      key: 'minTalk',
      label: 'Min Talk Time',
      value: statistics.minTalkTime,
      unit: 'sec',
      threshold: 120 // 2 minutes
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Queue Statistics
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Performance metrics and SLA compliance
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              SLA Compliance: {statistics.slaComplianceRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">
              {statistics.answeredCalls} answered / {statistics.totalCalls} total
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              threshold={stat.threshold}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Additional Metrics */}
        {!isLoading && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Wait</span>
                <span className="text-lg font-semibold text-gray-900">
                  {Math.floor(statistics.averageWaitTime / 60)}:{(statistics.averageWaitTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Talk</span>
                <span className="text-lg font-semibold text-gray-900">
                  {Math.floor(statistics.averageTalkTime / 60)}:{(statistics.averageTalkTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Abandoned</span>
                <span className="text-lg font-semibold text-red-600">
                  {statistics.abandonedCalls}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueStatistics; 