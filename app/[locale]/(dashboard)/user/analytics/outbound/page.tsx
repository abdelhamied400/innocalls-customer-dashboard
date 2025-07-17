"use client";

import React, { useState, useEffect } from "react";
import StatsCard from "@/components/StatsCard";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import { BarChart3, Phone, Clock, Users, TrendingUp } from "lucide-react";
import {
  Timer,
  PieChart as PieChartIcon,
  Users as UsersIcon,
  BarChart3 as BarChartIcon,
  Clock as ClockIcon,
  Table as TableIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// --- Summary Cards Data ---
const summaryStats = [
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />, // Example icon
    title: "Total Outbound Calls",
    value: 510, // Replace with real data if available
    color: "bg-blue-50 text-blue-800",
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "Total Agents",
    value: 5, // Replace with real data if available
    color: "bg-green-50 text-green-800",
  },
  {
    icon: <Clock className="w-6 h-6 text-indigo-600" />,
    title: "Avg Call Duration (s)",
    value: 32, // Replace with real data if available
    color: "bg-indigo-50 text-indigo-800",
  },
];

// --- Static Data ---
const talkTimeDistribution = [
  { totalCalls: 451, timeBucket: "0-1min" },
  { totalCalls: 116, timeBucket: "1-3min" },
  { totalCalls: 35, timeBucket: "3-5min" },
  { totalCalls: 54, timeBucket: "5-10min" },
  { totalCalls: 14, timeBucket: "10-15min" },
  { totalCalls: 13, timeBucket: "15min+" },
];

const agentStats = [
  {
    ext: "4455",
    name: "Agent A",
    totalCalls: 100,
    answeredCalls: 80,
    unansweredCalls: 20,
    internalCalls: 10,
    externalCalls: 90,
    totalDuration: 3000,
    avgDuration: 30,
  },
  {
    ext: "4456",
    name: "Agent B",
    totalCalls: 120,
    answeredCalls: 95,
    unansweredCalls: 25,
    internalCalls: 15,
    externalCalls: 105,
    totalDuration: 4000,
    avgDuration: 33,
  },
  {
    ext: "1062",
    name: "Agent C",
    totalCalls: 80,
    answeredCalls: 65,
    unansweredCalls: 15,
    internalCalls: 10,
    externalCalls: 70,
    totalDuration: 2500,
    avgDuration: 31,
  },
  {
    ext: "1039",
    name: "Agent D",
    totalCalls: 110,
    answeredCalls: 90,
    unansweredCalls: 20,
    internalCalls: 15,
    externalCalls: 95,
    totalDuration: 3500,
    avgDuration: 32,
  },
  {
    ext: "1060",
    name: "Agent E",
    totalCalls: 90,
    answeredCalls: 75,
    unansweredCalls: 15,
    internalCalls: 10,
    externalCalls: 80,
    totalDuration: 2800,
    avgDuration: 31,
  },
];

const hourlyDistribution = [
  {
    hourOfDay: 6,
    totalCalls: 4,
    answeredCalls: 0,
    unansweredCalls: 4,
    internalCalls: 4,
    externalCalls: 0,
  },
  {
    hourOfDay: 7,
    totalCalls: 4,
    answeredCalls: 0,
    unansweredCalls: 4,
    internalCalls: 4,
    externalCalls: 0,
  },
  {
    hourOfDay: 8,
    totalCalls: 5,
    answeredCalls: 1,
    unansweredCalls: 4,
    internalCalls: 4,
    externalCalls: 1,
  },
  {
    hourOfDay: 9,
    totalCalls: 5,
    answeredCalls: 0,
    unansweredCalls: 5,
    internalCalls: 4,
    externalCalls: 1,
  },
  {
    hourOfDay: 10,
    totalCalls: 6,
    answeredCalls: 1,
    unansweredCalls: 5,
    internalCalls: 4,
    externalCalls: 2,
  },
  {
    hourOfDay: 11,
    totalCalls: 5,
    answeredCalls: 1,
    unansweredCalls: 4,
    internalCalls: 4,
    externalCalls: 1,
  },
  {
    hourOfDay: 12,
    totalCalls: 20,
    answeredCalls: 1,
    unansweredCalls: 19,
    internalCalls: 4,
    externalCalls: 16,
  },
  {
    hourOfDay: 13,
    totalCalls: 7,
    answeredCalls: 3,
    unansweredCalls: 4,
    internalCalls: 4,
    externalCalls: 3,
  },
  {
    hourOfDay: 14,
    totalCalls: 1,
    answeredCalls: 1,
    unansweredCalls: 0,
    internalCalls: 0,
    externalCalls: 1,
  },
];

const callsDistribution = [
  {
    date: "18-06",
    totalCalls: 118,
    internalCalls: 96,
    externalCalls: 22,
    totalAnsweredCalls: 11,
    totalUnAnsweredCalls: 107,
    answerRate: 9.32,
    totalDuration: "00:20:06",
    avgDuration: "00:01:49",
    shortestCall: "00:00:07",
    longestCall: "00:06:59",
  },
  {
    date: "19-06",
    totalCalls: 125,
    internalCalls: 95,
    externalCalls: 30,
    totalAnsweredCalls: 13,
    totalUnAnsweredCalls: 112,
    answerRate: 10.4,
    totalDuration: "00:29:25",
    avgDuration: "00:02:15",
    shortestCall: "00:00:05",
    longestCall: "00:08:01",
  },
  {
    date: "20-06",
    totalCalls: 97,
    internalCalls: 95,
    externalCalls: 2,
    totalAnsweredCalls: 2,
    totalUnAnsweredCalls: 95,
    answerRate: 2.06,
    totalDuration: "00:03:06",
    avgDuration: "00:01:33",
    shortestCall: "00:01:02",
    longestCall: "00:02:04",
  },
  {
    date: "21-06",
    totalCalls: 104,
    internalCalls: 96,
    externalCalls: 8,
    totalAnsweredCalls: 4,
    totalUnAnsweredCalls: 100,
    answerRate: 3.85,
    totalDuration: "00:05:35",
    avgDuration: "00:01:23",
    shortestCall: "00:00:59",
    longestCall: "00:02:04",
  },
  {
    date: "22-06",
    totalCalls: 139,
    internalCalls: 97,
    externalCalls: 42,
    totalAnsweredCalls: 21,
    totalUnAnsweredCalls: 118,
    answerRate: 15.11,
    totalDuration: "00:12:56",
    avgDuration: "00:00:36",
    shortestCall: "00:00:01",
    longestCall: "00:01:55",
  },
  {
    date: "23-06",
    totalCalls: 144,
    internalCalls: 96,
    externalCalls: 48,
    totalAnsweredCalls: 25,
    totalUnAnsweredCalls: 119,
    answerRate: 17.36,
    totalDuration: "00:37:56",
    avgDuration: "00:01:31",
    shortestCall: "00:00:02",
    longestCall: "00:10:10",
  },
  {
    date: "24-06",
    totalCalls: 151,
    internalCalls: 95,
    externalCalls: 56,
    totalAnsweredCalls: 36,
    totalUnAnsweredCalls: 115,
    answerRate: 23.84,
    totalDuration: "00:33:58",
    avgDuration: "00:00:56",
    shortestCall: "00:00:01",
    longestCall: "00:11:06",
  },
  {
    date: "25-06",
    totalCalls: 161,
    internalCalls: 94,
    externalCalls: 67,
    totalAnsweredCalls: 37,
    totalUnAnsweredCalls: 124,
    answerRate: 22.98,
    totalDuration: "01:39:25",
    avgDuration: "00:02:41",
    shortestCall: "00:00:01",
    longestCall: "00:23:08",
  },
  {
    date: "26-06",
    totalCalls: 179,
    internalCalls: 94,
    externalCalls: 85,
    totalAnsweredCalls: 28,
    totalUnAnsweredCalls: 151,
    answerRate: 15.64,
    totalDuration: "00:36:00",
    avgDuration: "00:01:17",
    shortestCall: "00:00:01",
    longestCall: "00:07:36",
  },
  {
    date: "27-06",
    totalCalls: 96,
    internalCalls: 95,
    externalCalls: 1,
    totalAnsweredCalls: 0,
    totalUnAnsweredCalls: 96,
    answerRate: 0,
    totalDuration: "00:00:00",
    avgDuration: "00:00:00",
    shortestCall: "00:00:00",
    longestCall: "00:00:00",
  },
  {
    date: "28-06",
    totalCalls: 98,
    internalCalls: 96,
    externalCalls: 2,
    totalAnsweredCalls: 1,
    totalUnAnsweredCalls: 97,
    answerRate: 1.02,
    totalDuration: "00:00:04",
    avgDuration: "00:00:04",
    shortestCall: "00:00:04",
    longestCall: "00:00:04",
  },
  {
    date: "29-06",
    totalCalls: 159,
    internalCalls: 95,
    externalCalls: 64,
    totalAnsweredCalls: 43,
    totalUnAnsweredCalls: 116,
    answerRate: 27.04,
    totalDuration: "01:42:02",
    avgDuration: "00:02:22",
    shortestCall: "00:00:02",
    longestCall: "00:20:37",
  },
  {
    date: "30-06",
    totalCalls: 124,
    internalCalls: 100,
    externalCalls: 24,
    totalAnsweredCalls: 14,
    totalUnAnsweredCalls: 110,
    answerRate: 11.29,
    totalDuration: "01:08:45",
    avgDuration: "00:04:54",
    shortestCall: "00:00:01",
    longestCall: "00:25:08",
  },
  {
    date: "01-07",
    totalCalls: 183,
    internalCalls: 128,
    externalCalls: 55,
    totalAnsweredCalls: 55,
    totalUnAnsweredCalls: 128,
    answerRate: 30.05,
    totalDuration: "01:11:55",
    avgDuration: "00:01:18",
    shortestCall: "00:00:02",
    longestCall: "00:21:00",
  },
  {
    date: "02-07",
    totalCalls: 151,
    internalCalls: 109,
    externalCalls: 42,
    totalAnsweredCalls: 34,
    totalUnAnsweredCalls: 117,
    answerRate: 22.52,
    totalDuration: "01:03:02",
    avgDuration: "00:01:51",
    shortestCall: "00:00:01",
    longestCall: "00:10:51",
  },
  {
    date: "03-07",
    totalCalls: 109,
    internalCalls: 96,
    externalCalls: 13,
    totalAnsweredCalls: 6,
    totalUnAnsweredCalls: 103,
    answerRate: 5.5,
    totalDuration: "00:14:59",
    avgDuration: "00:02:29",
    shortestCall: "00:00:05",
    longestCall: "00:07:18",
  },
  {
    date: "04-07",
    totalCalls: 106,
    internalCalls: 95,
    externalCalls: 11,
    totalAnsweredCalls: 1,
    totalUnAnsweredCalls: 105,
    answerRate: 0.94,
    totalDuration: "00:00:05",
    avgDuration: "00:00:05",
    shortestCall: "00:00:05",
    longestCall: "00:00:05",
  },
  {
    date: "05-07",
    totalCalls: 102,
    internalCalls: 96,
    externalCalls: 6,
    totalAnsweredCalls: 5,
    totalUnAnsweredCalls: 97,
    answerRate: 4.9,
    totalDuration: "00:26:27",
    avgDuration: "00:05:17",
    shortestCall: "00:00:02",
    longestCall: "00:12:03",
  },
  {
    date: "06-07",
    totalCalls: 184,
    internalCalls: 100,
    externalCalls: 84,
    totalAnsweredCalls: 28,
    totalUnAnsweredCalls: 156,
    answerRate: 15.22,
    totalDuration: "00:45:25",
    avgDuration: "00:01:37",
    shortestCall: "00:00:02",
    longestCall: "00:11:03",
  },
  {
    date: "07-07",
    totalCalls: 209,
    internalCalls: 136,
    externalCalls: 73,
    totalAnsweredCalls: 58,
    totalUnAnsweredCalls: 151,
    answerRate: 27.75,
    totalDuration: "01:09:42",
    avgDuration: "00:01:12",
    shortestCall: "00:00:01",
    longestCall: "00:14:07",
  },
  {
    date: "08-07",
    totalCalls: 149,
    internalCalls: 101,
    externalCalls: 48,
    totalAnsweredCalls: 34,
    totalUnAnsweredCalls: 115,
    answerRate: 22.82,
    totalDuration: "00:54:36",
    avgDuration: "00:01:36",
    shortestCall: "00:00:01",
    longestCall: "00:09:45",
  },
  {
    date: "09-07",
    totalCalls: 187,
    internalCalls: 99,
    externalCalls: 88,
    totalAnsweredCalls: 50,
    totalUnAnsweredCalls: 137,
    answerRate: 26.74,
    totalDuration: "01:37:56",
    avgDuration: "00:01:57",
    shortestCall: "00:00:01",
    longestCall: "00:13:16",
  },
  {
    date: "10-07",
    totalCalls: 152,
    internalCalls: 96,
    externalCalls: 56,
    totalAnsweredCalls: 22,
    totalUnAnsweredCalls: 130,
    answerRate: 14.47,
    totalDuration: "01:31:14",
    avgDuration: "00:04:08",
    shortestCall: "00:00:02",
    longestCall: "00:59:43",
  },
  {
    date: "11-07",
    totalCalls: 95,
    internalCalls: 95,
    externalCalls: 0,
    totalAnsweredCalls: 0,
    totalUnAnsweredCalls: 95,
    answerRate: 0,
    totalDuration: "00:00:00",
    avgDuration: "00:00:00",
    shortestCall: "00:00:00",
    longestCall: "00:00:00",
  },
  {
    date: "12-07",
    totalCalls: 119,
    internalCalls: 96,
    externalCalls: 23,
    totalAnsweredCalls: 16,
    totalUnAnsweredCalls: 103,
    answerRate: 13.45,
    totalDuration: "00:05:29",
    avgDuration: "00:00:20",
    shortestCall: "00:00:01",
    longestCall: "00:01:45",
  },
  {
    date: "13-07",
    totalCalls: 169,
    internalCalls: 94,
    externalCalls: 75,
    totalAnsweredCalls: 30,
    totalUnAnsweredCalls: 139,
    answerRate: 17.75,
    totalDuration: "00:32:37",
    avgDuration: "00:01:05",
    shortestCall: "00:00:02",
    longestCall: "00:07:46",
  },
  {
    date: "14-07",
    totalCalls: 151,
    internalCalls: 98,
    externalCalls: 53,
    totalAnsweredCalls: 22,
    totalUnAnsweredCalls: 129,
    answerRate: 14.57,
    totalDuration: "00:48:50",
    avgDuration: "00:02:13",
    shortestCall: "00:00:03",
    longestCall: "00:15:16",
  },
  {
    date: "15-07",
    totalCalls: 197,
    internalCalls: 102,
    externalCalls: 95,
    totalAnsweredCalls: 45,
    totalUnAnsweredCalls: 152,
    answerRate: 22.84,
    totalDuration: "01:37:35",
    avgDuration: "00:02:10",
    shortestCall: "00:00:01",
    longestCall: "00:21:26",
  },
  {
    date: "16-07",
    totalCalls: 165,
    internalCalls: 101,
    externalCalls: 64,
    totalAnsweredCalls: 35,
    totalUnAnsweredCalls: 130,
    answerRate: 21.21,
    totalDuration: "01:53:55",
    avgDuration: "00:03:15",
    shortestCall: "00:00:02",
    longestCall: "00:21:43",
  },
  {
    date: "17-07",
    totalCalls: 56,
    internalCalls: 32,
    externalCalls: 24,
    totalAnsweredCalls: 7,
    totalUnAnsweredCalls: 49,
    answerRate: 12.5,
    totalDuration: "00:29:42",
    avgDuration: "00:04:14",
    shortestCall: "00:00:09",
    longestCall: "00:14:29",
  },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E42",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

// --- Tabs ---
const tabs = [
  {
    id: "talk-time-distribution",
    label: "Talk Time Distribution",
    icon: <Timer className="w-4 h-4" />,
  },
  {
    id: "hourly-distribution",
    label: "Hourly Distribution",
    icon: <ClockIcon className="w-4 h-4" />,
  },
  {
    id: "date-distribution",
    label: "Date Distribution",
    icon: <BarChartIcon className="w-4 h-4" />,
  },
  {
    id: "agent-stats",
    label: "Agent Stats",
    icon: <UsersIcon className="w-4 h-4" />,
  },
];

// Type definitions for props

type TalkTimeDistribution = { totalCalls: number; timeBucket: string }[];
type AgentStats = {
  ext: string;
  name: string;
  totalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
  internalCalls: number;
  externalCalls: number;
  totalDuration: number;
  avgDuration: number;
}[];
type HourlyDistribution = {
  hourOfDay: number;
  totalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
  internalCalls: number;
  externalCalls: number;
}[];
type DateDistribution = {
  date: string;
  totalCalls: number;
  internalCalls: number;
  externalCalls: number;
  totalAnsweredCalls: number;
  totalUnAnsweredCalls: number;
  answerRate: number;
  totalDuration: string;
  avgDuration: string;
  shortestCall: string;
  longestCall: string;
}[];

// --- Chart/Table Components ---
function TalkTimePieChart({ data }: { data: TalkTimeDistribution }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalCalls"
          nameKey="timeBucket"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip />
        <RechartsLegend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function AgentStatsTable({ data }: { data: AgentStats }) {
  return (
    <div className="overflow-x-auto max-h-96">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">Ext</th>
            <th className="px-2 py-1">Name</th>
            <th className="px-2 py-1">Total</th>
            <th className="px-2 py-1">Answered</th>
            <th className="px-2 py-1">Unanswered</th>
            <th className="px-2 py-1">Internal</th>
            <th className="px-2 py-1">External</th>
            <th className="px-2 py-1">Total Duration</th>
            <th className="px-2 py-1">Avg Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.ext}>
              <td className="px-2 py-1">{row.ext}</td>
              <td className="px-2 py-1">{row.name}</td>
              <td className="px-2 py-1">{row.totalCalls}</td>
              <td className="px-2 py-1">{row.answeredCalls}</td>
              <td className="px-2 py-1">{row.unansweredCalls}</td>
              <td className="px-2 py-1">{row.internalCalls}</td>
              <td className="px-2 py-1">{row.externalCalls}</td>
              <td className="px-2 py-1">{row.totalDuration}</td>
              <td className="px-2 py-1">{row.avgDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AgentStatsBarChart({ data }: { data: AgentStats }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <RechartsTooltip />
        <RechartsLegend />
        <Bar dataKey="totalCalls" fill="#3B82F6" name="Total Calls" />
        <Bar dataKey="answeredCalls" fill="#10B981" name="Answered" />
        <Bar dataKey="unansweredCalls" fill="#EF4444" name="Unanswered" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function HourlyLineChart({ data }: { data: HourlyDistribution }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="hourOfDay"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <RechartsTooltip />
        <RechartsLegend />
        <Line
          type="monotone"
          dataKey="totalCalls"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          name="Total"
        />
        <Line
          type="monotone"
          dataKey="answeredCalls"
          stroke="#10B981"
          strokeWidth={2}
          dot={false}
          name="Answered"
        />
        <Line
          type="monotone"
          dataKey="unansweredCalls"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          name="Unanswered"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DateLineChart({ data }: { data: DateDistribution }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <RechartsTooltip />
        <RechartsLegend />
        <Line
          type="monotone"
          dataKey="totalCalls"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          name="Total"
        />
        <Line
          type="monotone"
          dataKey="totalAnsweredCalls"
          stroke="#10B981"
          strokeWidth={2}
          dot={false}
          name="Answered"
        />
        <Line
          type="monotone"
          dataKey="totalUnAnsweredCalls"
          stroke="#EF4444"
          strokeWidth={2}
          dot={false}
          name="Unanswered"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DateTable({ data }: { data: DateDistribution }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">Total</th>
            <th className="px-2 py-1">Internal</th>
            <th className="px-2 py-1">External</th>
            <th className="px-2 py-1">Answered</th>
            <th className="px-2 py-1">Unanswered</th>
            <th className="px-2 py-1">Answer Rate</th>
            <th className="px-2 py-1">Total Duration</th>
            <th className="px-2 py-1">Avg Duration</th>
            <th className="px-2 py-1">Shortest</th>
            <th className="px-2 py-1">Longest</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-2 py-1">{row.date}</td>
              <td className="px-2 py-1">{row.totalCalls}</td>
              <td className="px-2 py-1">{row.internalCalls}</td>
              <td className="px-2 py-1">{row.externalCalls}</td>
              <td className="px-2 py-1">{row.totalAnsweredCalls}</td>
              <td className="px-2 py-1">{row.totalUnAnsweredCalls}</td>
              <td className="px-2 py-1">{row.answerRate}%</td>
              <td className="px-2 py-1">{row.totalDuration}</td>
              <td className="px-2 py-1">{row.avgDuration}</td>
              <td className="px-2 py-1">{row.shortestCall}</td>
              <td className="px-2 py-1">{row.longestCall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add HourlyDistributionTable component
function HourlyDistributionTable({ data }: { data: HourlyDistribution }) {
  return (
    <div className="overflow-x-auto max-h-96">
      <table className="min-w-full text-sm text-left">
        <thead>
          <tr>
            <th className="px-2 py-1">Hour</th>
            <th className="px-2 py-1">Total Calls</th>
            <th className="px-2 py-1">Answered</th>
            <th className="px-2 py-1">Unanswered</th>
            <th className="px-2 py-1">Internal</th>
            <th className="px-2 py-1">External</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="px-2 py-1">{row.hourOfDay}</td>
              <td className="px-2 py-1">{row.totalCalls}</td>
              <td className="px-2 py-1">{row.answeredCalls}</td>
              <td className="px-2 py-1">{row.unansweredCalls}</td>
              <td className="px-2 py-1">{row.internalCalls}</td>
              <td className="px-2 py-1">{row.externalCalls}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Main Component ---
const OutboundAnalytics = () => {
  // Use separate showTable state for each tab
  const [showTable, setShowTable] = useState({
    "hourly-distribution": false,
    "date-distribution": false,
    "agent-stats": false,
  });
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return { from: sevenDaysAgo, to: today };
  });

  // Example: update data on date range change (replace with real data logic)
  const handleDateRangeChange = (fromDate: Date, toDate: Date) => {
    setDateRange({ from: fromDate, to: toDate });
    // Fetch or generate new data here if needed
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {summaryStats.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Analytics Tabs */}
      <AnalyticsTabs tabs={tabs} defaultTab="talk-time-distribution">
        {/* Talk Time Distribution Tab (no toggle) */}
        <div className="space-y-6">
          <div>
            <TalkTimePieChart data={talkTimeDistribution} />
          </div>
        </div>
        {/* Hourly Distribution Tab (toggle) */}
        <div className="space-y-6">
          <div className="flex justify-end mb-2">
            <button
              className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
              onClick={() =>
                setShowTable((prev) => ({
                  ...prev,
                  "hourly-distribution": !prev["hourly-distribution"],
                }))
              }
            >
              {showTable["hourly-distribution"] ? "Show Chart" : "Show Table"}
            </button>
          </div>
          <div>
            {showTable["hourly-distribution"] ? (
              <HourlyDistributionTable data={hourlyDistribution} />
            ) : (
              <HourlyLineChart data={hourlyDistribution} />
            )}
          </div>
        </div>
        {/* Date Distribution Tab (toggle) */}
        <div className="space-y-6">
          <div className="flex justify-end mb-2">
            <button
              className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
              onClick={() =>
                setShowTable((prev) => ({
                  ...prev,
                  "date-distribution": !prev["date-distribution"],
                }))
              }
            >
              {showTable["date-distribution"] ? "Show Chart" : "Show Table"}
            </button>
          </div>
          <div>
            {showTable["date-distribution"] ? (
              <DateTable data={callsDistribution} />
            ) : (
              <DateLineChart data={callsDistribution} />
            )}
          </div>
        </div>
        {/* Agent Stats Tab (toggle) */}
        <div className="space-y-6">
          <div className="flex justify-end mb-2">
            <button
              className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
              onClick={() =>
                setShowTable((prev) => ({
                  ...prev,
                  "agent-stats": !prev["agent-stats"],
                }))
              }
            >
              {showTable["agent-stats"] ? "Show Chart" : "Show Table"}
            </button>
          </div>
          <div>
            {showTable["agent-stats"] ? (
              <AgentStatsTable data={agentStats} />
            ) : (
              <AgentStatsBarChart data={agentStats} />
            )}
          </div>
        </div>
      </AnalyticsTabs>
    </div>
  );
};

export default OutboundAnalytics;
