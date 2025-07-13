"use client";

import React from 'react';
import { LiveCallDetailsProps, LiveCallCardProps } from '@/types/liveMonitoring';

// Loading Skeleton for Call Card
const CallCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
        <div className="w-28 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Individual Call Card Component
const LiveCallCard: React.FC<LiveCallCardProps> = ({ call, isLoading = false }) => {
  if (isLoading) {
    return <CallCardSkeleton />;
  }

  const formatPhoneNumber = (phone: string) => {
    // Simple formatting for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getStatusColor = () => {
    switch (call.status) {
      case 'connected':
        return 'bg-green-500';
      case 'ringing':
        return 'bg-blue-500';
      case 'on-hold':
        return 'bg-yellow-500';
      case 'transferring':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {call.status}
        </span>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">From</p>
          <p className="text-sm font-medium text-gray-900">
            {formatPhoneNumber(call.callerNumber)}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-1">To</p>
          <p className="text-sm font-medium text-gray-900">
            {formatPhoneNumber(call.recipientNumber)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Live Call Details Component
const LiveCallDetails: React.FC<LiveCallDetailsProps> = ({ calls, isLoading = false }) => {
  const activeCalls = calls.filter(call => 
    ['ringing', 'connected', 'on-hold', 'transferring'].includes(call.status)
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              General Live Call Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Real-time monitoring of active calls
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {activeCalls.length} Active Calls
            </span>
          </div>
        </div>
      </div>

      {/* Call Cards */}
      <div className="p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <CallCardSkeleton key={i} />
            ))}
          </div>
        ) : activeCalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCalls.slice(0, 3).map((call) => (
              <LiveCallCard key={call.callId} call={call} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📞</span>
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Active Calls
            </h4>
            <p className="text-sm text-gray-600">
              There are currently no active calls in the system
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCallDetails; 