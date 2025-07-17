"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import {
  PhoneOff,
  PhoneCall,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
} from "lucide-react";

import OutboundUnansweredHourlyChart from "@/components/Analytics/OutboundUnansweredHourlyChart";
import OutboundCallDistributionLineChart from "@/components/Analytics/OutboundCallDistributionChart";

// Function to generate data based on date range
const generateUnansweredData = (fromDate: Date, toDate: Date) => {
  const daysDiff = Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const multiplier = Math.max(1, daysDiff / 7);

  return {
    outboundUnanswered: Array.from(
      { length: Math.min(daysDiff, 30) },
      (_, i) => {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + i);
        const totalCalls = Math.floor(Math.random() * 50) + 100;
        const unanswered = Math.floor(Math.random() * 20) + 10;
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          totalOutboundCalls: totalCalls,
          unansweredCalls: unanswered,
        };
      }
    ),
  };
};

// SUMMARY CARDS DATA
const summaryData = {
  totalUnansweredCalls: 131,
  totalExternalUnansweredIncomingCalls: 1,
  totalExternalUnansweredOutgoingCalls: 32,
  totalInternalUnansweredCalls: 98,
};

// SEPARATE DATA SOURCES FOR CHARTS
// Example inbound unanswered data
const inboundChartData = [
  { date: "2024-07-01", internal: 12, external: 5, unanswered: 17 },
  { date: "2024-07-02", internal: 10, external: 7, unanswered: 17 },
  { date: "2024-07-03", internal: 15, external: 4, unanswered: 19 },
];
// Example outbound unanswered data
const outboundChartData = [
  { date: "2024-07-01", internal: 8, external: 14, unanswered: 22 },
  { date: "2024-07-02", internal: 9, external: 11, unanswered: 20 },
  { date: "2024-07-03", internal: 7, external: 13, unanswered: 20 },
];

const summaryStats = [
  {
    icon: <PhoneOff className="w-6 h-6 text-red-600" />,
    title: "Total Unanswered Calls",
    value: summaryData.totalUnansweredCalls,
    color: "bg-red-50 text-red-800",
  },
  {
    icon: <ArrowDownLeft className="w-6 h-6 text-blue-600" />,
    title: "External Unanswered Incoming",
    value: summaryData.totalExternalUnansweredIncomingCalls,
    color: "bg-blue-50 text-blue-800",
  },
  {
    icon: <ArrowUpRight className="w-6 h-6 text-orange-600" />,
    title: "External Unanswered Outgoing",
    value: summaryData.totalExternalUnansweredOutgoingCalls,
    color: "bg-orange-50 text-orange-800",
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: "Internal Unanswered Calls",
    value: summaryData.totalInternalUnansweredCalls,
    color: "bg-purple-50 text-purple-800",
  },
];

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

  const tabs = [
    {
      id: "inbound",
      label: "Inbound Unanswered",
      icon: <PhoneOff className="w-4 h-4" />,
    },
    {
      id: "outbound",
      label: "Outbound Unanswered",
      icon: <PhoneCall className="w-4 h-4" />,
    },
  ];

  const outboundUnansweredDaily = data.outboundUnanswered.map((day) => ({
    date: day.date,
    totalOutboundCalls: day.totalOutboundCalls,
    unansweredCalls: day.unansweredCalls,
    totalOutboundInternal: Math.floor(Math.random() * 5), // Placeholder for internal
    totalOutboundExternal: Math.floor(Math.random() * 10), // Placeholder for external
    internalUnanswered: Math.floor(Math.random() * 5), // Placeholder for internal
    externalUnanswered: Math.floor(Math.random() * 10), // Placeholder for external
  }));

  const outboundUnansweredHourly = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    internal: Math.floor(Math.random() * 10), // Placeholder for internal
    external: Math.floor(Math.random() * 20), // Placeholder for external
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <div
            key={stat.title}
            className={`p-4 rounded-lg border ${stat.color}`}
          >
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PhoneOff className="w-5 h-5 text-blue-600" />
                Inbound Unanswered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OutboundCallDistributionLineChart
                data={outboundUnansweredDaily}
              />
            </CardContent>
          </Card>
          <OutboundUnansweredHourlyChart
            data={outboundUnansweredHourly}
            barColors={{ internal: "#06B6D4", external: "#6366F1" }}
          />
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
              <OutboundCallDistributionLineChart
                data={outboundUnansweredDaily}
              />
            </CardContent>
          </Card>
          <OutboundUnansweredHourlyChart
            data={outboundUnansweredHourly}
            barColors={{ internal: "#3b82f6", external: "#9CA3AF" }}
          />
        </div>
      </AnalyticsTabs>
    </div>
  );
};

export default UnansweredAnalytics;
