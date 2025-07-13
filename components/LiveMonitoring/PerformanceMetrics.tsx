"use client";

import React, { useState, useEffect } from 'react';
import { PerformanceMetricsProps } from '@/types/liveMonitoring';

// Animated Number Component
interface AnimatedNumberProps {
  value: number;
  unit: string;
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, unit, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(Math.round(currentValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className="text-4xl font-bold">
        {displayValue}
      </span>
      <span className="text-lg">
        {unit}
      </span>
    </div>
  );
};

// Loading Skeleton
const PerformanceMetricSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="w-32 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-24 h-10 bg-gray-200 rounded"></div>
        <div className="w-40 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Individual Performance Metric
interface PerformanceMetricCardProps {
  metric: {
    value: number;
    label: string;
    unit: string;
    target?: number;
    color: 'green' | 'yellow' | 'red' | 'blue';
    icon?: React.ReactNode;
  };
  isLoading?: boolean;
}

const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({ metric, isLoading = false }) => {
  if (isLoading) {
    return <PerformanceMetricSkeleton />;
  }

  const getColorClasses = () => {
    switch (metric.color) {
      case 'green':
        return {
          card: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
          icon: 'bg-green-500 text-white',
          value: 'text-green-700',
          label: 'text-green-600',
          target: 'text-green-500'
        };
      case 'yellow':
        return {
          card: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
          icon: 'bg-yellow-500 text-white',
          value: 'text-yellow-700',
          label: 'text-yellow-600',
          target: 'text-yellow-500'
        };
      case 'red':
        return {
          card: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
          icon: 'bg-red-500 text-white',
          value: 'text-red-700',
          label: 'text-red-600',
          target: 'text-red-500'
        };
      case 'blue':
        return {
          card: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
          icon: 'bg-blue-500 text-white',
          value: 'text-blue-700',
          label: 'text-blue-600',
          target: 'text-blue-500'
        };
      default:
        return {
          card: 'bg-white border-gray-200',
          icon: 'bg-gray-500 text-white',
          value: 'text-gray-700',
          label: 'text-gray-600',
          target: 'text-gray-500'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`p-6 rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md ${colors.card}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.icon}`}>
          {metric.icon || <span className="text-lg">📊</span>}
        </div>
        <h3 className={`text-lg font-semibold ${colors.label}`}>
          {metric.label}
        </h3>
      </div>
      
      <div className="space-y-2">
        <AnimatedNumber 
          value={metric.value} 
          unit={metric.unit}
          className={colors.value}
        />
        
        {metric.target && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${colors.target}`}>
              Target: {metric.target}{metric.unit}
            </span>
            <div className={`w-2 h-2 rounded-full ${colors.target}`}></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Performance Metrics Component
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  answerRate, 
  averageWaitTime, 
  isLoading = false 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PerformanceMetricCard
        metric={{
          ...answerRate,
          icon: <span className="text-lg">✅</span>
        }}
        isLoading={isLoading}
      />
      <PerformanceMetricCard
        metric={{
          ...averageWaitTime,
          icon: <span className="text-lg">⏱️</span>
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PerformanceMetrics; 