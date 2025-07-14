"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import WaitTimeBarChart from "@/components/Analytics/WaitTimeBarChart";
import TalkTimeBarChart from "@/components/Analytics/TalkTimeBarChart";
import CallDistributionLineChart from "@/components/Analytics/CallDistributionLineChart";
import AgentPerformanceChart from "@/components/Analytics/AgentPerformanceChart";
import IvrDistributionChart from "@/components/Analytics/IvrDistributionChart";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import { BarChart3, Users, Phone, Clock, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Function to generate data based on date range
const generateDataForDateRange = (fromDate: Date, toDate: Date) => {
  const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const multiplier = Math.max(1, daysDiff / 7); // Scale data based on date range

  return {
    waitTimeDistribution: [
      { timeBucket: "0-5 sec", avgWaitTime: 2.5, totalCalls: Math.floor(45 * multiplier) },
      { timeBucket: "6-10 sec", avgWaitTime: 8.2, totalCalls: Math.floor(78 * multiplier) },
      { timeBucket: "11-15 sec", avgWaitTime: 13.1, totalCalls: Math.floor(52 * multiplier) },
      { timeBucket: "16-20 sec", avgWaitTime: 18.3, totalCalls: Math.floor(28 * multiplier) },
      { timeBucket: "21-30 sec", avgWaitTime: 25.7, totalCalls: Math.floor(15 * multiplier) },
      { timeBucket: "30+ sec", avgWaitTime: 45.2, totalCalls: Math.floor(8 * multiplier) },
    ],
    talkTimeDistribution: [
      { timeBucket: "0-30 sec", totalCalls: Math.floor(32 * multiplier) },
      { timeBucket: "31-60 sec", totalCalls: Math.floor(67 * multiplier) },
      { timeBucket: "1-2 min", totalCalls: Math.floor(89 * multiplier) },
      { timeBucket: "2-3 min", totalCalls: Math.floor(45 * multiplier) },
      { timeBucket: "3-5 min", totalCalls: Math.floor(23 * multiplier) },
      { timeBucket: "5+ min", totalCalls: Math.floor(12 * multiplier) },
    ],
    callDistribution: [
      { hourOfDay: 6, totalCalls: Math.floor(8 * multiplier), completedCalls: Math.floor(6 * multiplier), abandonedCalls: Math.floor(1 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:08", avgTalkTime: "00:01:15" },
      { hourOfDay: 7, totalCalls: Math.floor(15 * multiplier), completedCalls: Math.floor(12 * multiplier), abandonedCalls: Math.floor(2 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:12", avgTalkTime: "00:01:22" },
      { hourOfDay: 8, totalCalls: Math.floor(28 * multiplier), completedCalls: Math.floor(24 * multiplier), abandonedCalls: Math.floor(3 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:10", avgTalkTime: "00:01:18" },
      { hourOfDay: 9, totalCalls: Math.floor(42 * multiplier), completedCalls: Math.floor(37 * multiplier), abandonedCalls: Math.floor(4 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:09", avgTalkTime: "00:01:25" },
      { hourOfDay: 10, totalCalls: Math.floor(58 * multiplier), completedCalls: Math.floor(51 * multiplier), abandonedCalls: Math.floor(5 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:11", avgTalkTime: "00:01:30" },
      { hourOfDay: 11, totalCalls: Math.floor(65 * multiplier), completedCalls: Math.floor(58 * multiplier), abandonedCalls: Math.floor(5 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:08", avgTalkTime: "00:01:28" },
      { hourOfDay: 12, totalCalls: Math.floor(52 * multiplier), completedCalls: Math.floor(46 * multiplier), abandonedCalls: Math.floor(4 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:13", avgTalkTime: "00:01:20" },
      { hourOfDay: 13, totalCalls: Math.floor(48 * multiplier), completedCalls: Math.floor(43 * multiplier), abandonedCalls: Math.floor(3 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:10", avgTalkTime: "00:01:15" },
      { hourOfDay: 14, totalCalls: Math.floor(55 * multiplier), completedCalls: Math.floor(49 * multiplier), abandonedCalls: Math.floor(4 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:09", avgTalkTime: "00:01:22" },
      { hourOfDay: 15, totalCalls: Math.floor(62 * multiplier), completedCalls: Math.floor(56 * multiplier), abandonedCalls: Math.floor(4 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:11", avgTalkTime: "00:01:26" },
      { hourOfDay: 16, totalCalls: Math.floor(58 * multiplier), completedCalls: Math.floor(52 * multiplier), abandonedCalls: Math.floor(4 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:12", avgTalkTime: "00:01:24" },
      { hourOfDay: 17, totalCalls: Math.floor(45 * multiplier), completedCalls: Math.floor(40 * multiplier), abandonedCalls: Math.floor(3 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:10", avgTalkTime: "00:01:18" },
      { hourOfDay: 18, totalCalls: Math.floor(32 * multiplier), completedCalls: Math.floor(28 * multiplier), abandonedCalls: Math.floor(2 * multiplier), timeoutCalls: Math.floor(2 * multiplier), avgWaitTime: "00:00:14", avgTalkTime: "00:01:12" },
      { hourOfDay: 19, totalCalls: Math.floor(18 * multiplier), completedCalls: Math.floor(15 * multiplier), abandonedCalls: Math.floor(2 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:16", avgTalkTime: "00:01:08" },
      { hourOfDay: 20, totalCalls: Math.floor(12 * multiplier), completedCalls: Math.floor(10 * multiplier), abandonedCalls: Math.floor(1 * multiplier), timeoutCalls: Math.floor(1 * multiplier), avgWaitTime: "00:00:18", avgTalkTime: "00:01:05" },
    ],
    agentPerformance: [
      { agentExt: 4456, callsHandled: Math.floor(25 * multiplier), avgWaitTime: "00:00:12", avgTalkTime: "00:02:15", totalWaitTime: "00:05:00", totalTalkTime: "00:56:15", minCustomerQueuePosition: 1, maxCustomerPosition: 3 },
      { agentExt: 1039, callsHandled: Math.floor(32 * multiplier), avgWaitTime: "00:00:08", avgTalkTime: "00:01:45", totalWaitTime: "00:04:16", totalTalkTime: "00:56:00", minCustomerQueuePosition: 1, maxCustomerPosition: 2 },
      { agentExt: 1062, callsHandled: Math.floor(18 * multiplier), avgWaitTime: "00:00:15", avgTalkTime: "00:02:30", totalWaitTime: "00:04:30", totalTalkTime: "00:45:00", minCustomerQueuePosition: 1, maxCustomerPosition: 4 },
      { agentExt: 1060, callsHandled: Math.floor(28 * multiplier), avgWaitTime: "00:00:10", avgTalkTime: "00:01:55", totalWaitTime: "00:04:40", totalTalkTime: "00:54:20", minCustomerQueuePosition: 1, maxCustomerPosition: 2 },
      { agentExt: 4455, callsHandled: Math.floor(22 * multiplier), avgWaitTime: "00:00:14", avgTalkTime: "00:02:05", totalWaitTime: "00:05:08", totalTalkTime: "00:45:50", minCustomerQueuePosition: 1, maxCustomerPosition: 3 },
    ],
    ivrDistribution: [
      {
        ivrName: "Main Menu",
        options: [
          { optionNumber: 1, clickCount: Math.floor(45 * multiplier), optionName: "Sales" },
          { optionNumber: 2, clickCount: Math.floor(38 * multiplier), optionName: "Support" },
          { optionNumber: 3, clickCount: Math.floor(22 * multiplier), optionName: "Billing" },
          { optionNumber: 4, clickCount: Math.floor(15 * multiplier), optionName: "General" },
        ]
      },
      {
        ivrName: "Support Menu",
        options: [
          { optionNumber: 1, clickCount: Math.floor(28 * multiplier), optionName: "Technical" },
          { optionNumber: 2, clickCount: Math.floor(32 * multiplier), optionName: "Account" },
          { optionNumber: 3, clickCount: Math.floor(18 * multiplier), optionName: "Product" },
          { optionNumber: 4, clickCount: Math.floor(12 * multiplier), optionName: "Other" },
        ]
      },
      {
        ivrName: "Sales Menu",
        options: [
          { optionNumber: 1, clickCount: Math.floor(35 * multiplier), optionName: "New Sales" },
          { optionNumber: 2, clickCount: Math.floor(25 * multiplier), optionName: "Upgrades" },
          { optionNumber: 3, clickCount: Math.floor(20 * multiplier), optionName: "Pricing" },
          { optionNumber: 4, clickCount: Math.floor(15 * multiplier), optionName: "Demo" },
        ]
      }
    ],
    callers: [
      {
        caller: "4456",
        totalCalls: 3,
        abandonedCalls: 0,
        timeoutCalls: 1,
        completedCalls: 2,
        abandonRate: 0,
        timeoutRate: 33.33,
        completionRate: 66.67,
        avgWaitTime: "00:02:39",
        avgTalkTime: "00:00:28",
        firstCallTime: "2025-06-01 09:12:54",
        lastCallTime: "2025-06-03 10:21:35"
      },
      {
        caller: "4455",
        totalCalls: 3,
        abandonedCalls: 2,
        timeoutCalls: 1,
        completedCalls: 0,
        abandonRate: 66.67,
        timeoutRate: 33.33,
        completionRate: 0,
        avgWaitTime: "00:03:02",
        avgTalkTime: "00:00:00",
        firstCallTime: "2025-06-01 09:16:47",
        lastCallTime: "2025-06-03 10:19:19"
      }
    ]
  };
};

const InboundAnalytics = () => {
  const [data, setData] = useState(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return generateDataForDateRange(sevenDaysAgo, today);
  });

  const handleDateRangeChange = (fromDate: Date, toDate: Date) => {
    const newData = generateDataForDateRange(fromDate, toDate);
    setData(newData);
  };

  // Calculate summary stats from current data
  const totalCalls = data.callDistribution.reduce((sum, hour) => sum + hour.totalCalls, 0);
  const completedCalls = data.callDistribution.reduce((sum, hour) => sum + hour.completedCalls, 0);
  const abandonedCalls = data.callDistribution.reduce((sum, hour) => sum + hour.abandonedCalls, 0);
  const timeoutCalls = data.callDistribution.reduce((sum, hour) => sum + hour.timeoutCalls, 0);

  const summaryStats = [
    { icon: "/assets/icons/stats/add-call.svg", title: "Total Calls", value: totalCalls },
    { icon: "/assets/icons/stats/timer.svg", title: "Avg Wait Time", value: "00:00:11" },
    { icon: "/assets/icons/stats/erg/today.png", title: "Avg Talk Time", value: "00:01:20" },
    { icon: "/assets/icons/stats/calendar.svg", title: "Completed", value: completedCalls },
    { icon: "/assets/icons/stats/erg/hourglass_empty.png", title: "Timeout", value: timeoutCalls },
    { icon: "/assets/icons/stats/erg/mini/ring_volume.svg", title: "Abandoned", value: abandonedCalls },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "distribution", label: "Distribution", icon: <PieChart className="w-4 h-4" /> },
    { id: "agents", label: "Agent Performance", icon: <Users className="w-4 h-4" /> },
    { id: "ivr", label: "IVR Analysis", icon: <Phone className="w-4 h-4" /> },
    { id: "repeated", label: "Repeated Callers", icon: <Users className="w-4 h-4 text-yellow-500" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={<img src={stat.icon} alt="" className="w-6 h-6" />}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Analytics Tabs */}
      <AnalyticsTabs tabs={tabs} defaultTab="overview">
        {/* Overview Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call Distribution by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <CallDistributionLineChart data={data.callDistribution} />
            </CardContent>
          </Card>
        </div>

        {/* Distribution Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wait Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <WaitTimeBarChart data={data.waitTimeDistribution} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Talk Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TalkTimeBarChart data={data.talkTimeDistribution} />
            </CardContent>
          </Card>
        </div>

        {/* Agent Performance Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentPerformanceChart data={data.agentPerformance} />
            </CardContent>
          </Card>
          
          {/* Agent Performance Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Agent Ext</th>
                      <th className="text-left p-2">Calls Handled</th>
                      <th className="text-left p-2">Avg Wait Time</th>
                      <th className="text-left p-2">Avg Talk Time</th>
                      <th className="text-left p-2">Queue Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.agentPerformance.map((agent) => (
                      <tr key={agent.agentExt} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{agent.agentExt}</td>
                        <td className="p-2">{agent.callsHandled}</td>
                        <td className="p-2">{agent.avgWaitTime}</td>
                        <td className="p-2">{agent.avgTalkTime}</td>
                        <td className="p-2">{agent.minCustomerQueuePosition}-{agent.maxCustomerPosition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IVR Analysis Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IVR Option Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <IvrDistributionChart data={data.ivrDistribution} />
            </CardContent>
          </Card>

          {/* IVR Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.ivrDistribution.map((ivr) => (
              <Card key={ivr.ivrName}>
                <CardHeader>
                  <CardTitle className="text-lg">{ivr.ivrName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ivr.options.map((option) => (
                      <div key={option.optionNumber} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Option {option.optionNumber}</span>
                        <span className="text-blue-600 font-semibold">{option.clickCount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Repeated Callers Tab */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Repeated Callers</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Stacked Bar Chart */}
              <div className="w-full h-80 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.callers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="caller" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completedCalls" stackId="a" fill="#10B981" name="Completed" />
                    <Bar dataKey="abandonedCalls" stackId="a" fill="#F59E42" name="Abandoned" />
                    <Bar dataKey="timeoutCalls" stackId="a" fill="#EF4444" name="Timeout" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Caller</th>
                      <th className="text-left p-2">Total Calls</th>
                      <th className="text-left p-2">Abandoned</th>
                      <th className="text-left p-2">Timeout</th>
                      <th className="text-left p-2">Completed</th>
                      <th className="text-left p-2">Abandon Rate (%)</th>
                      <th className="text-left p-2">Timeout Rate (%)</th>
                      <th className="text-left p-2">Completion Rate (%)</th>
                      <th className="text-left p-2">Avg Wait Time</th>
                      <th className="text-left p-2">Avg Talk Time</th>
                      <th className="text-left p-2">First Call</th>
                      <th className="text-left p-2">Last Call</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.callers.map((caller) => (
                      <tr key={caller.caller} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{caller.caller}</td>
                        <td className="p-2">{caller.totalCalls}</td>
                        <td className="p-2">{caller.abandonedCalls}</td>
                        <td className="p-2">{caller.timeoutCalls}</td>
                        <td className="p-2">{caller.completedCalls}</td>
                        <td className="p-2">{caller.abandonRate}</td>
                        <td className="p-2">{caller.timeoutRate}</td>
                        <td className="p-2">{caller.completionRate}</td>
                        <td className="p-2">{caller.avgWaitTime}</td>
                        <td className="p-2">{caller.avgTalkTime}</td>
                        <td className="p-2">{caller.firstCallTime}</td>
                        <td className="p-2">{caller.lastCallTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnalyticsTabs>
    </div>
  );
};

export default InboundAnalytics; 