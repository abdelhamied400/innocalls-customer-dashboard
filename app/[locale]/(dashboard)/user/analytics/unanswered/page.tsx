"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import AbandonedCallsChart from "@/components/Analytics/AbandonedCallsChart";
import ExitTimeoutChart from "@/components/Analytics/ExitTimeoutChart";
import OutboundUnansweredChart from "@/components/Analytics/OutboundUnansweredChart";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import { PhoneOff, Clock, PhoneCall, AlertTriangle } from "lucide-react";

// Function to generate data based on date range
const generateUnansweredData = (fromDate: Date, toDate: Date) => {
  const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const multiplier = Math.max(1, daysDiff / 7);

  return {
    abandonedCalls: {
      totalAbandonedCalls: Math.floor(45 * multiplier),
      uniqueCallersAbandoned: Math.floor(38 * multiplier),
      queuesWithAbandons: Math.floor(5 * multiplier),
      avgWaitTimeBeforeAbandon: Math.floor(45 * multiplier),
      minWaitTimeBeforeAbandon: Math.floor(8 * multiplier),
      maxWaitTimeBeforeAbandon: Math.floor(180 * multiplier),
      avgInitialQueuePosition: 2.3,
      minInitialQueuePosition: 1,
      maxInitialQueuePosition: 8,
      quickAbandons_0_10s: Math.floor(12 * multiplier),
      shortWait_11_30s: Math.floor(18 * multiplier),
      mediumWait_31_60s: Math.floor(8 * multiplier),
      longWait_1_2min: Math.floor(5 * multiplier),
      veryLongWait_2min_plus: Math.floor(2 * multiplier),
      peakAbandonHour: 14,
    },
    exitTimeout: {
      totalTimeoutCalls: Math.floor(28 * multiplier),
      uniqueCallersTimeout: Math.floor(25 * multiplier),
      queuesWithTimeouts: Math.floor(4 * multiplier),
      avgWaitTimeBeforeTimeout: Math.floor(120 * multiplier),
      minWaitTimeBeforeTimeout: Math.floor(60 * multiplier),
      maxWaitTimeBeforeTimeout: Math.floor(300 * multiplier),
      avgInitialQueuePosition: 3.1,
      minInitialQueuePosition: 1,
      maxInitialQueuePosition: 12,
      quickTimeouts_0_10s: Math.floor(2 * multiplier),
      shortWait_11_30s: Math.floor(5 * multiplier),
      mediumWait_31_60s: Math.floor(8 * multiplier),
      longWait_1_2min: Math.floor(10 * multiplier),
      veryLongWait_2min_plus: Math.floor(3 * multiplier),
      peakTimeoutHour: 15,
    },
    outboundUnanswered: Array.from({ length: Math.min(daysDiff, 30) }, (_, i) => {
      const date = new Date(fromDate);
      date.setDate(date.getDate() + i);
      const totalCalls = Math.floor(Math.random() * 50) + 100;
      const unanswered = Math.floor(Math.random() * 20) + 10;
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalOutboundCalls: totalCalls,
        unansweredCalls: unanswered,
      };
    }),
  };
};

const UnansweredAnalytics = () => {
  const [data, setData] = useState(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return generateUnansweredData(sevenDaysAgo, today);
  });

  const handleDateRangeChange = (fromDate: Date, toDate: Date) => {
    const newData = generateUnansweredData(fromDate, toDate);
    setData(newData);
  };

  // Calculate overall summary stats
  const totalInboundUnanswered = data.abandonedCalls.totalAbandonedCalls + data.exitTimeout.totalTimeoutCalls;
  const totalOutboundUnanswered = data.outboundUnanswered.reduce((sum, day) => sum + day.unansweredCalls, 0);
  const totalUnanswered = totalInboundUnanswered + totalOutboundUnanswered;

  const summaryStats = [
    { 
      icon: <PhoneOff className="w-6 h-6 text-red-600" />, 
      title: "Total Unanswered", 
      value: totalUnanswered,
      color: "bg-red-50 text-red-800"
    },
    { 
      icon: <AlertTriangle className="w-6 h-6 text-orange-600" />, 
      title: "Inbound Unanswered", 
      value: totalInboundUnanswered,
      color: "bg-orange-50 text-orange-800"
    },
    { 
      icon: <PhoneCall className="w-6 h-6 text-blue-600" />, 
      title: "Outbound Unanswered", 
      value: totalOutboundUnanswered,
      color: "bg-blue-50 text-blue-800"
    },
    { 
      icon: <Clock className="w-6 h-6 text-purple-600" />, 
      title: "Avg Wait Time", 
      value: `${Math.floor((data.abandonedCalls.avgWaitTimeBeforeAbandon + data.exitTimeout.avgWaitTimeBeforeTimeout) / 2 / 60)}:${(((data.abandonedCalls.avgWaitTimeBeforeAbandon + data.exitTimeout.avgWaitTimeBeforeTimeout) / 2) % 60).toString().padStart(2, '0')}`,
      color: "bg-purple-50 text-purple-800"
    },
  ];

  const tabs = [
    { id: "inbound", label: "Inbound Unanswered", icon: <PhoneOff className="w-4 h-4" /> },
    { id: "outbound", label: "Outbound Unanswered", icon: <PhoneCall className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <div key={stat.title} className={`p-4 rounded-lg border ${stat.color}`}>
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <h3 className="text-lg font-semibold">{stat.title}</h3>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Tabs */}
      <AnalyticsTabs tabs={tabs} defaultTab="inbound">
        {/* Inbound Unanswered Tab */}
        <div className="space-y-6">
          {/* Abandoned Calls Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Abandoned Calls Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AbandonedCallsChart data={data.abandonedCalls} />
            </CardContent>
          </Card>

          {/* Exit Timeout Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Exit Timeout Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExitTimeoutChart data={data.exitTimeout} />
            </CardContent>
          </Card>

          {/* Comparison Section */}
          <Card>
            <CardHeader>
              <CardTitle>Inbound Unanswered Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Abandoned vs Timeout</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">Abandoned Calls</span>
                      <span className="text-red-600 font-semibold">{data.abandonedCalls.totalAbandonedCalls}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="font-medium">Timeout Calls</span>
                      <span className="text-purple-600 font-semibold">{data.exitTimeout.totalTimeoutCalls}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="font-medium">Total Inbound Unanswered</span>
                      <span className="text-blue-600 font-semibold">{totalInboundUnanswered}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Wait Time Comparison</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="font-medium">Avg Abandon Wait</span>
                      <span className="text-red-600 font-semibold">
                        {Math.floor(data.abandonedCalls.avgWaitTimeBeforeAbandon / 60)}:{(data.abandonedCalls.avgWaitTimeBeforeAbandon % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                      <span className="font-medium">Avg Timeout Wait</span>
                      <span className="text-purple-600 font-semibold">
                        {Math.floor(data.exitTimeout.avgWaitTimeBeforeTimeout / 60)}:{(data.exitTimeout.avgWaitTimeBeforeTimeout % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Peak Hours</span>
                      <span className="text-gray-600 font-semibold">
                        {data.abandonedCalls.peakAbandonHour}:00 / {data.exitTimeout.peakTimeoutHour}:00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outbound Unanswered Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-blue-600" />
                Outbound Unanswered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OutboundUnansweredChart data={data.outboundUnanswered} />
            </CardContent>
          </Card>
        </div>
      </AnalyticsTabs>
    </div>
  );
};

export default UnansweredAnalytics; 