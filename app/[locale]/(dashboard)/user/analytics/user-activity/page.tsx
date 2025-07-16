"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import UserCallMetricsChart from "@/components/Analytics/UserCallMetricsChart";

import {
  Clock,
  TrendingUp,
  BarChart4,
  PhoneIncoming,
  PhoneOutgoing,
  Award,
  AlertTriangle,
} from "lucide-react";

import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Label,
  CartesianGrid,
} from "recharts";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// Function to generate user activity data
const generateUserActivityData = (fromDate: Date, toDate: Date) => {
  const daysDiff = Math.ceil(
    (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const multiplier = Math.max(1, daysDiff / 7);

  // Generate daily activity timeline
  const activityTimeline = [];
  for (let i = 0; i < Math.min(daysDiff, 30); i++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + i);
    activityTimeline.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      activeUsers: Math.floor(Math.random() * 20) + 10,
      totalLogins: Math.floor(Math.random() * 35) + 15,
      avgSessionTime: Math.floor(Math.random() * 240) + 120, // 2-6 hours
      peakHour: Math.floor(Math.random() * 8) + 9, // 9 AM - 5 PM
    });
  }

  // Generate hourly availability data
  const hourlyAvailability = [];
  for (let hour = 6; hour <= 22; hour++) {
    const availableUsers = Math.floor(Math.random() * 15) + 5;
    const totalUsers = 25;
    hourlyAvailability.push({
      hour: hour,
      availableUsers,
      totalUsers,
      availabilityRate: Math.round((availableUsers / totalUsers) * 100),
    });
  }

  // Generate performance metrics
  const performanceMetrics = [
    {
      metric: "Response Time",
      value: Math.floor(Math.random() * 30) + 10,
      unit: "sec",
      trend: "up",
    },
    {
      metric: "Call Quality",
      value: Math.floor(Math.random() * 20) + 80,
      unit: "%",
      trend: "up",
    },
    {
      metric: "Uptime",
      value: Math.floor(Math.random() * 10) + 95,
      unit: "%",
      trend: "stable",
    },
    {
      metric: "User Satisfaction",
      value: Math.floor(Math.random() * 15) + 85,
      unit: "%",
      trend: "up",
    },
  ];

  return {
    activityTimeline,
    hourlyAvailability,
    performanceMetrics,
  };
};

// Replace agentCallDistribution, agentPerformance, slaAnalysis with new data
const callsDistribution = [
  {
    ext: 1025,
    name: "abdelhamied",
    totalCalls: 131,
    totalIncomingCalls: 58,
    totalOutgoingCalls: 73,
    totalIncomingInternalCalls: 58,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 29,
    totalOutgoingExternalCalls: 44,
    totalAnsweredIncomingCalls: 39,
    totalConnectedOutgoingCalls: 29,
  },
  {
    ext: 1028,
    name: "Kamal",
    totalCalls: 133,
    totalIncomingCalls: 15,
    totalOutgoingCalls: 118,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 15,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 118,
    totalAnsweredIncomingCalls: 7,
    totalConnectedOutgoingCalls: 19,
  },
  {
    ext: 1033,
    name: "WebCall",
    totalCalls: 1,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 1,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 1,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 1,
  },
  {
    ext: 1037,
    name: "Agent 1037",
    totalCalls: 305,
    totalIncomingCalls: 305,
    totalOutgoingCalls: 0,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 305,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 0,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 0,
  },
  {
    ext: 1039,
    name: "Ahmed Rabiea",
    totalCalls: 135,
    totalIncomingCalls: 43,
    totalOutgoingCalls: 92,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 43,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 92,
    totalAnsweredIncomingCalls: 10,
    totalConnectedOutgoingCalls: 58,
  },
  {
    ext: 1040,
    name: "Ahmed Abdullah",
    totalCalls: 722,
    totalIncomingCalls: 596,
    totalOutgoingCalls: 126,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 596,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 126,
    totalAnsweredIncomingCalls: 61,
    totalConnectedOutgoingCalls: 86,
  },
  {
    ext: 1044,
    name: "Donia Mahmoud",
    totalCalls: 64,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 64,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 64,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 39,
  },
  {
    ext: 1060,
    name: "Goda Ashraf",
    totalCalls: 202,
    totalIncomingCalls: 14,
    totalOutgoingCalls: 188,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 14,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 188,
    totalAnsweredIncomingCalls: 4,
    totalConnectedOutgoingCalls: 96,
  },
  {
    ext: 1062,
    name: "Shaimaa Ashraf",
    totalCalls: 156,
    totalIncomingCalls: 56,
    totalOutgoingCalls: 100,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 56,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 100,
    totalAnsweredIncomingCalls: 16,
    totalConnectedOutgoingCalls: 60,
  },
  {
    ext: 1888,
    name: "1888",
    totalCalls: 2,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 2,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 2,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 0,
  },
  {
    ext: 2222,
    name: "DotcomMonitoring",
    totalCalls: 2919,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 2919,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 2919,
    totalOutgoingExternalCalls: 0,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 3,
  },
  {
    ext: 3333,
    name: "Ext Salem Testing",
    totalCalls: 8,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 8,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 1,
    totalOutgoingExternalCalls: 7,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 5,
  },
  {
    ext: 4444,
    name: "Mohammad Salem",
    totalCalls: 230,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 230,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 230,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 106,
  },
  {
    ext: 4445,
    name: "Aml",
    totalCalls: 40,
    totalIncomingCalls: 6,
    totalOutgoingCalls: 34,
    totalIncomingInternalCalls: 6,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 1,
    totalOutgoingExternalCalls: 33,
    totalAnsweredIncomingCalls: 5,
    totalConnectedOutgoingCalls: 18,
  },
  {
    ext: 4446,
    name: "Aml 08",
    totalCalls: 31,
    totalIncomingCalls: 7,
    totalOutgoingCalls: 24,
    totalIncomingInternalCalls: 7,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 23,
    totalOutgoingExternalCalls: 1,
    totalAnsweredIncomingCalls: 3,
    totalConnectedOutgoingCalls: 22,
  },
  {
    ext: 4448,
    name: "Aml 02",
    totalCalls: 8,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 8,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 8,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 8,
  },
  {
    ext: 4449,
    name: "Ali Saleh",
    totalCalls: 5,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 5,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 5,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 5,
  },
  {
    ext: 4452,
    name: "Hala",
    totalCalls: 6,
    totalIncomingCalls: 5,
    totalOutgoingCalls: 1,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 5,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 1,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 1,
  },
  {
    ext: 4453,
    name: "Ali Saleh",
    totalCalls: 82,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 82,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 2,
    totalOutgoingExternalCalls: 80,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 34,
  },
  {
    ext: 4455,
    name: "Aml 4455",
    totalCalls: 89,
    totalIncomingCalls: 42,
    totalOutgoingCalls: 47,
    totalIncomingInternalCalls: 42,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 16,
    totalOutgoingExternalCalls: 31,
    totalAnsweredIncomingCalls: 24,
    totalConnectedOutgoingCalls: 22,
  },
  {
    ext: 4456,
    name: "aml 4456",
    totalCalls: 155,
    totalIncomingCalls: 2,
    totalOutgoingCalls: 153,
    totalIncomingInternalCalls: 2,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 6,
    totalOutgoingExternalCalls: 147,
    totalAnsweredIncomingCalls: 2,
    totalConnectedOutgoingCalls: 78,
  },
  {
    ext: 4459,
    name: "aml 4456",
    totalCalls: 25,
    totalIncomingCalls: 3,
    totalOutgoingCalls: 22,
    totalIncomingInternalCalls: 3,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 5,
    totalOutgoingExternalCalls: 17,
    totalAnsweredIncomingCalls: 3,
    totalConnectedOutgoingCalls: 10,
  },
  {
    ext: 4462,
    name: "asdfsdf",
    totalCalls: 77,
    totalIncomingCalls: 12,
    totalOutgoingCalls: 65,
    totalIncomingInternalCalls: 12,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 28,
    totalOutgoingExternalCalls: 37,
    totalAnsweredIncomingCalls: 5,
    totalConnectedOutgoingCalls: 36,
  },
  {
    ext: 4463,
    name: "T 001",
    totalCalls: 21,
    totalIncomingCalls: 1,
    totalOutgoingCalls: 20,
    totalIncomingInternalCalls: 1,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 4,
    totalOutgoingExternalCalls: 16,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 13,
  },
  {
    ext: 4464,
    name: "Agent 4464",
    totalCalls: 6,
    totalIncomingCalls: 0,
    totalOutgoingCalls: 6,
    totalIncomingInternalCalls: 0,
    totalIncomingExternalCalls: 0,
    totalOutgoingInternalCalls: 0,
    totalOutgoingExternalCalls: 6,
    totalAnsweredIncomingCalls: 0,
    totalConnectedOutgoingCalls: 3,
  },
];

const agentPerformance = [
  {
    ext: 2222,
    name: "DotcomMonitoring",
    totalCalls: 2920,
    avgCallDuration: "00:00:00",
    totalTalkTime: "00:00:47",
    answeredCount: 3,
    answerRate: "0.10",
    longestCall: "00:00:44",
    shortestCall: "00:00:01",
  },
  {
    ext: 1040,
    name: "Ahmed Abdullah",
    totalCalls: 723,
    avgCallDuration: "00:00:37",
    totalTalkTime: "07:29:56",
    answeredCount: 148,
    answerRate: "20.47",
    longestCall: "00:31:44",
    shortestCall: "00:00:02",
  },
  {
    ext: 1037,
    name: "Agent 1037",
    totalCalls: 305,
    avgCallDuration: "00:00:00",
    totalTalkTime: "00:00:00",
    answeredCount: 0,
    answerRate: 0,
    longestCall: "00:00:00",
    shortestCall: "00:00:00",
  },
  {
    ext: 4444,
    name: "Mohammad Salem",
    totalCalls: 230,
    avgCallDuration: "00:00:27",
    totalTalkTime: "01:45:17",
    answeredCount: 106,
    answerRate: "46.09",
    longestCall: "00:59:43",
    shortestCall: "00:00:01",
  },
  {
    ext: 1060,
    name: "Goda Ashraf",
    totalCalls: 203,
    avgCallDuration: "00:01:52",
    totalTalkTime: "06:20:57",
    answeredCount: 100,
    answerRate: "49.26",
    longestCall: "00:21:26",
    shortestCall: "00:00:01",
  },
  {
    ext: 1062,
    name: "Shaimaa Ashraf",
    totalCalls: 157,
    avgCallDuration: "00:01:55",
    totalTalkTime: "05:00:55",
    answeredCount: 76,
    answerRate: "48.41",
    longestCall: "00:15:16",
    shortestCall: "00:00:03",
  },
  {
    ext: 4456,
    name: "aml 4456",
    totalCalls: 155,
    avgCallDuration: "00:00:19",
    totalTalkTime: "00:51:33",
    answeredCount: 80,
    answerRate: "51.61",
    longestCall: "00:05:01",
    shortestCall: "00:00:04",
  },
  {
    ext: 1039,
    name: "Ahmed Rabiea",
    totalCalls: 135,
    avgCallDuration: "00:01:54",
    totalTalkTime: "04:18:02",
    answeredCount: 68,
    answerRate: "50.37",
    longestCall: "00:25:08",
    shortestCall: "00:00:02",
  },
  {
    ext: 1028,
    name: "Kamal",
    totalCalls: 133,
    avgCallDuration: "00:00:09",
    totalTalkTime: "00:20:37",
    answeredCount: 26,
    answerRate: "19.55",
    longestCall: "00:05:10",
    shortestCall: "00:00:01",
  },
  {
    ext: 1025,
    name: "abdelhamied",
    totalCalls: 131,
    avgCallDuration: "00:00:12",
    totalTalkTime: "00:27:59",
    answeredCount: 68,
    answerRate: "51.91",
    longestCall: "00:08:33",
    shortestCall: "00:00:01",
  },
  {
    ext: 4455,
    name: "Aml 4455",
    totalCalls: 89,
    avgCallDuration: "00:00:20",
    totalTalkTime: "00:30:52",
    answeredCount: 46,
    answerRate: "51.69",
    longestCall: "00:03:35",
    shortestCall: "00:00:02",
  },
  {
    ext: 4453,
    name: "Ali Saleh",
    totalCalls: 82,
    avgCallDuration: "00:00:08",
    totalTalkTime: "00:11:36",
    answeredCount: 34,
    answerRate: "41.46",
    longestCall: "00:01:45",
    shortestCall: "00:00:01",
  },
  {
    ext: 4462,
    name: "asdfsdf",
    totalCalls: 77,
    avgCallDuration: "00:00:09",
    totalTalkTime: "00:12:12",
    answeredCount: 41,
    answerRate: "53.25",
    longestCall: "00:02:43",
    shortestCall: "00:00:01",
  },
  {
    ext: 1044,
    name: "Donia Mahmoud",
    totalCalls: 64,
    avgCallDuration: "00:00:44",
    totalTalkTime: "00:47:01",
    answeredCount: 39,
    answerRate: "60.94",
    longestCall: "00:06:12",
    shortestCall: "00:00:03",
  },
  {
    ext: 4445,
    name: "Aml",
    totalCalls: 40,
    avgCallDuration: "00:00:17",
    totalTalkTime: "00:11:55",
    answeredCount: 23,
    answerRate: "57.50",
    longestCall: "00:02:42",
    shortestCall: "00:00:01",
  },
  {
    ext: 4446,
    name: "Aml 08",
    totalCalls: 31,
    avgCallDuration: "00:00:14",
    totalTalkTime: "00:07:15",
    answeredCount: 25,
    answerRate: "80.65",
    longestCall: "00:02:41",
    shortestCall: "00:00:02",
  },
  {
    ext: 4459,
    name: "aml 4456",
    totalCalls: 25,
    avgCallDuration: "00:00:08",
    totalTalkTime: "00:03:42",
    answeredCount: 13,
    answerRate: "52.00",
    longestCall: "00:01:17",
    shortestCall: "00:00:02",
  },
  {
    ext: 4463,
    name: "T 001",
    totalCalls: 21,
    avgCallDuration: "00:00:09",
    totalTalkTime: "00:03:10",
    answeredCount: 13,
    answerRate: "61.90",
    longestCall: "00:00:41",
    shortestCall: "00:00:02",
  },
  {
    ext: 3333,
    name: "Ext Salem Testing",
    totalCalls: 8,
    avgCallDuration: "00:00:02",
    totalTalkTime: "00:00:19",
    answeredCount: 5,
    answerRate: "62.50",
    longestCall: "00:00:09",
    shortestCall: "00:00:01",
  },
  {
    ext: 4448,
    name: "Aml 02",
    totalCalls: 8,
    avgCallDuration: "00:00:14",
    totalTalkTime: "00:01:53",
    answeredCount: 8,
    answerRate: "100.00",
    longestCall: "00:00:30",
    shortestCall: "00:00:05",
  },
  {
    ext: 4464,
    name: "Agent 4464",
    totalCalls: 6,
    avgCallDuration: "00:00:04",
    totalTalkTime: "00:00:26",
    answeredCount: 3,
    answerRate: "50.00",
    longestCall: "00:00:11",
    shortestCall: "00:00:07",
  },
  {
    ext: 4452,
    name: "Hala",
    totalCalls: 6,
    avgCallDuration: "00:00:39",
    totalTalkTime: "00:03:58",
    answeredCount: 1,
    answerRate: "16.67",
    longestCall: "00:03:58",
    shortestCall: "00:03:58",
  },
  {
    ext: 4449,
    name: "Ali Saleh",
    totalCalls: 5,
    avgCallDuration: "00:00:13",
    totalTalkTime: "00:01:08",
    answeredCount: 5,
    answerRate: "100.00",
    longestCall: "00:00:29",
    shortestCall: "00:00:06",
  },
  {
    ext: 1888,
    name: "1888",
    totalCalls: 2,
    avgCallDuration: "00:00:00",
    totalTalkTime: "00:00:00",
    answeredCount: 0,
    answerRate: 0,
    longestCall: "00:00:00",
    shortestCall: "00:00:00",
  },
  {
    ext: 1033,
    name: "WebCall",
    totalCalls: 1,
    avgCallDuration: "00:00:07",
    totalTalkTime: "00:00:07",
    answeredCount: 1,
    answerRate: "100.00",
    longestCall: "00:00:07",
    shortestCall: "00:00:07",
  },
];

const responseTimeAnalysis = [
  {
    ext: 4462,
    name: "asdfsdf",
    totalIncomingCalls: 12,
    answeredIncomingCalls: 5,
    avgResponseTime: "00:00:05",
    callsAnsweredWithinSLA: 5,
    slaCompliance: "100.00",
  },
  {
    ext: 4456,
    name: "aml 4456",
    totalIncomingCalls: 2,
    answeredIncomingCalls: 2,
    avgResponseTime: "00:00:03",
    callsAnsweredWithinSLA: 2,
    slaCompliance: "100.00",
  },
  {
    ext: 4446,
    name: "Aml 08",
    totalIncomingCalls: 7,
    answeredIncomingCalls: 3,
    avgResponseTime: "00:00:05",
    callsAnsweredWithinSLA: 3,
    slaCompliance: "100.00",
  },
  {
    ext: 1025,
    name: "abdelhamied",
    totalIncomingCalls: 58,
    answeredIncomingCalls: 39,
    avgResponseTime: "00:00:04",
    callsAnsweredWithinSLA: 37,
    slaCompliance: "94.87",
  },
  {
    ext: 4455,
    name: "Aml 4455",
    totalIncomingCalls: 42,
    answeredIncomingCalls: 24,
    avgResponseTime: "00:00:05",
    callsAnsweredWithinSLA: 22,
    slaCompliance: "91.67",
  },
  {
    ext: 4445,
    name: "Aml",
    totalIncomingCalls: 6,
    answeredIncomingCalls: 5,
    avgResponseTime: "00:00:07",
    callsAnsweredWithinSLA: 4,
    slaCompliance: "80.00",
  },
  {
    ext: 1028,
    name: "Kamal",
    totalIncomingCalls: 15,
    answeredIncomingCalls: 7,
    avgResponseTime: "00:00:07",
    callsAnsweredWithinSLA: 5,
    slaCompliance: "71.43",
  },
  {
    ext: 1062,
    name: "Shaimaa Ashraf",
    totalIncomingCalls: 54,
    answeredIncomingCalls: 16,
    avgResponseTime: "00:00:09",
    callsAnsweredWithinSLA: 11,
    slaCompliance: "68.75",
  },
  {
    ext: 4459,
    name: "aml 4456",
    totalIncomingCalls: 3,
    answeredIncomingCalls: 3,
    avgResponseTime: "00:00:09",
    callsAnsweredWithinSLA: 2,
    slaCompliance: "66.67",
  },
  {
    ext: 1040,
    name: "Ahmed Abdullah",
    totalIncomingCalls: 596,
    answeredIncomingCalls: 61,
    avgResponseTime: "00:00:17",
    callsAnsweredWithinSLA: 29,
    slaCompliance: "47.54",
  },
  {
    ext: 1039,
    name: "Ahmed Rabiea",
    totalIncomingCalls: 43,
    answeredIncomingCalls: 10,
    avgResponseTime: "00:00:16",
    callsAnsweredWithinSLA: 4,
    slaCompliance: "40.00",
  },
  {
    ext: 1060,
    name: "Goda Ashraf",
    totalIncomingCalls: 13,
    answeredIncomingCalls: 4,
    avgResponseTime: "00:00:21",
    callsAnsweredWithinSLA: 0,
    slaCompliance: 0,
  },
  {
    ext: 4463,
    name: "T 001",
    totalIncomingCalls: 1,
    answeredIncomingCalls: 0,
    avgResponseTime: "00:00:00",
    callsAnsweredWithinSLA: 0,
    slaCompliance: 0,
  },
  {
    ext: 1037,
    name: "Agent 1037",
    totalIncomingCalls: 305,
    answeredIncomingCalls: 0,
    avgResponseTime: "00:00:00",
    callsAnsweredWithinSLA: 0,
    slaCompliance: 0,
  },
  {
    ext: 4452,
    name: "Hala",
    totalIncomingCalls: 5,
    answeredIncomingCalls: 0,
    avgResponseTime: "00:00:00",
    callsAnsweredWithinSLA: 0,
    slaCompliance: 0,
  },
];

const agentOverview = {
  topAnsweredIncomingAgent: {
    ext: "1040",
    answeredIncomingCount: "9",
    name: "Ahmed Abdullah",
  },
  topConnectedOutboundAgent: {
    ext: "4463",
    connectedOutboundCount: "9",
    name: "T 001",
  },
  topSlaComplianceAgent: {
    ext: "1028",
    totalAnsweredIncoming: "3",
    answeredWithinSLA: "3",
    slaPercentage: 100,
    name: "Kamal",
  },
  topMissedIncomingAgent: {
    ext: "1028",
    missedIncomingCount: "4",
    name: "Kamal",
  },
  slaThreshold: 10,
};

// Helper to get color for SLA compliance
function getSlaColor(sla: string | number | null) {
  const val = sla === null ? 0 : typeof sla === 'string' ? parseFloat(sla) : sla;
  if (val >= 90) return '#22c55e'; // green
  if (val >= 70) return '#eab308'; // yellow
  if (val >= 50) return '#f59e42'; // orange
  if (val >= 30) return '#ef4444'; // red
  return '#991b1b'; // dark red
}

const UserActivityAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [showDistributionTable, setShowDistributionTable] = useState(false);
  const [showStatsTable, setShowStatsTable] = useState(false);
  const [showSLATable, setShowSLATable] = useState(false);
  // Add agent filter and SLA input state
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [slaInput, setSlaInput] = useState<number>(agentOverview.slaThreshold);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    setData(generateUserActivityData(sevenDaysAgo, today));
  }, []);

  const handleDateRangeChange = (fromDate: Date, toDate: Date) => {
    const newData = generateUserActivityData(fromDate, toDate);
    setData(newData);
  };

  const tabs = [
    {
      id: "call-distribution",
      label: "Call Distribution",
      icon: <BarChart4 className="w-4 h-4" />,
    },
    {
      id: "call-stats",
      label: "Call Stats",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "sla-compliance",
      label: "SLA Compliance",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  // Filter callsDistribution and agentPerformance based on selected agents
  const filteredCallDist =
    selectedAgents.length > 0
      ? callsDistribution.filter((a) => selectedAgents.includes(String(a.ext)))
      : callsDistribution;
  const filteredAgentPerf =
    selectedAgents.length > 0
      ? agentPerformance.filter((a) => selectedAgents.includes(String(a.ext)))
      : agentPerformance;
  const filteredResponseTime =
    selectedAgents.length > 0
      ? responseTimeAnalysis.filter((a) =>
          selectedAgents.includes(String(a.ext))
        )
      : responseTimeAnalysis;

  // Fix agent overview card calculations to avoid linter errors
  const topAnsweredIncoming =
    filteredCallDist.length > 0
      ? filteredCallDist.reduce(
          (max, a) =>
            a.totalAnsweredIncomingCalls > max.totalAnsweredIncomingCalls
              ? a
              : max,
          filteredCallDist[0]
        )
      : undefined;
  const topConnectedOutbound =
    filteredCallDist.length > 0
      ? filteredCallDist.reduce(
          (max, a) =>
            a.totalConnectedOutgoingCalls > max.totalConnectedOutgoingCalls
              ? a
              : max,
          filteredCallDist[0]
        )
      : undefined;
  const bestSlaAgent =
    filteredResponseTime.length > 0
      ? filteredResponseTime.reduce(
          (max, a) =>
            a.slaCompliance !== null &&
            a.slaCompliance > (max.slaCompliance || 0)
              ? a
              : max,
          filteredResponseTime[0]
        )
      : undefined;
  const mostMissedIncoming =
    filteredCallDist.length > 0
      ? filteredCallDist.reduce((max, a) => {
          const missed =
            Number(a.totalIncomingCalls) - Number(a.totalAnsweredIncomingCalls);
          const maxMissed =
            Number(max.totalIncomingCalls) -
            Number(max.totalAnsweredIncomingCalls);
          return missed > maxMissed ? a : max;
        }, filteredCallDist[0])
      : undefined;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Render agent overview cards only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<PhoneIncoming className="w-6 h-6 text-green-600" />}
          title="Top Answered Incoming"
          value={
            topAnsweredIncoming
              ? `${topAnsweredIncoming.name} (${topAnsweredIncoming.totalAnsweredIncomingCalls})`
              : "-"
          }
        />
        <StatsCard
          icon={<PhoneOutgoing className="w-6 h-6 text-blue-600" />}
          title="Top Connected Outbound"
          value={
            topConnectedOutbound
              ? `${topConnectedOutbound.name} (${topConnectedOutbound.totalConnectedOutgoingCalls})`
              : "-"
          }
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-yellow-500" />}
          title="Best SLA Agent"
          value={
            bestSlaAgent && bestSlaAgent.slaCompliance !== undefined
              ? `${bestSlaAgent.name} (${Number(
                  bestSlaAgent.slaCompliance
                ).toFixed(1)}%)`
              : "-"
          }
        />
        <StatsCard
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
          title="Most Missed Incoming"
          value={
            mostMissedIncoming
              ? `${mostMissedIncoming.name} (${
                  Number(mostMissedIncoming.totalIncomingCalls) -
                  Number(mostMissedIncoming.totalAnsweredIncomingCalls)
                })`
              : "-"
          }
        />
      </div>

      {/* Analytics Tabs */}
      {isClient && data && (
        <AnalyticsTabs
          tabs={tabs}
          defaultTab="call-distribution"
          children={[
            // Call Distribution Tab
            <div key="call-distribution" className="space-y-6">
              <div className="flex justify-end mb-2">
                <button
                  className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
                  onClick={() => setShowStatsTable((v) => !v)}
                >
                  {showStatsTable ? "Show Chart" : "Show Table"}
                </button>
              </div>
              {!showStatsTable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Call Distribution by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This chart shows the breakdown of incoming and outgoing
                      calls (internal and external) for each agent. Hover over a
                      bar to see exact values.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <BarChart
                        width={700}
                        height={400}
                        data={filteredCallDist}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number">
                          <Label
                            value="Number of Calls"
                            position="insideBottom"
                            offset={0}
                          />
                        </XAxis>
                        <YAxis dataKey="name" type="category" width={120}>
                          <Label
                            value="Agent"
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: "middle" }}
                          />
                        </YAxis>
                        <Tooltip
                          formatter={(value, name) => {
                            switch (name) {
                              case "totalIncomingInternalCalls":
                                return [value, "Incoming Internal"];
                              case "totalIncomingExternalCalls":
                                return [value, "Incoming External"];
                              case "totalOutgoingInternalCalls":
                                return [value, "Outgoing Internal"];
                              case "totalOutgoingExternalCalls":
                                return [value, "Outgoing External"];
                              default:
                                return [value, name];
                            }
                          }}
                          labelFormatter={(label) => `Agent: ${label}`}
                        />
                        <Bar
                          dataKey="totalIncomingInternalCalls"
                          stackId="a"
                          fill="#8B5CF6"
                          name="Incoming Internal"
                        />
                        <Bar
                          dataKey="totalIncomingExternalCalls"
                          stackId="a"
                          fill="#3B82F6"
                          name="Incoming External"
                        />
                        <Bar
                          dataKey="totalOutgoingInternalCalls"
                          stackId="b"
                          fill="#F59E42"
                          name="Outgoing Internal"
                        />
                        <Bar
                          dataKey="totalOutgoingExternalCalls"
                          stackId="b"
                          fill="#10B981"
                          name="Outgoing External"
                        />
                      </BarChart>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Call Distribution by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This table shows the breakdown of incoming and outgoing
                      calls (internal and external) for each agent.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agent</TableHead>
                            <TableHead>Total Calls</TableHead>
                            <TableHead>Incoming Internal</TableHead>
                            <TableHead>Incoming External</TableHead>
                            <TableHead>Outgoing Internal</TableHead>
                            <TableHead>Outgoing External</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCallDist.map((row) => (
                            <TableRow key={row.ext}>
                              <TableCell>
                                {row.name || `(${row.ext})`}
                              </TableCell>
                              <TableCell>{row.totalCalls}</TableCell>
                              <TableCell>
                                {row.totalIncomingInternalCalls}
                              </TableCell>
                              <TableCell>
                                {row.totalIncomingExternalCalls}
                              </TableCell>
                              <TableCell>
                                {row.totalOutgoingInternalCalls}
                              </TableCell>
                              <TableCell>
                                {row.totalOutgoingExternalCalls}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>,

            // Call Stats Tab
            <div key="call-stats" className="space-y-6">
              <div className="flex justify-end mb-2">
                <button
                  className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
                  onClick={() => setShowDistributionTable((v) => !v)}
                >
                  {showDistributionTable ? "Show Chart" : "Show Table"}
                </button>
              </div>
              {!showDistributionTable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Call Statistics by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This chart summarizes call statistics for each agent.
                      Hover over a bar to see exact values.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <BarChart
                        width={700}
                        height={400}
                        data={filteredAgentPerf}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number">
                          <Label
                            value="Number of Calls"
                            position="insideBottom"
                            offset={0}
                          />
                        </XAxis>
                        <YAxis dataKey="name" type="category" width={120}>
                          <Label
                            value="Agent"
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: "middle" }}
                          />
                        </YAxis>
                        <Tooltip
                          formatter={(value, name) => {
                            switch (name) {
                              case "totalCalls":
                                return [value, "Total Calls"];
                              case "answeredCount":
                                return [value, "Answered"];
                              default:
                                return [value, name];
                            }
                          }}
                          labelFormatter={(label) => `Agent: ${label}`}
                        />
                        <Bar
                          dataKey="totalCalls"
                          fill="#6366F1"
                          name="Total Calls"
                        />
                        <Bar
                          dataKey="answeredCount"
                          fill="#10B981"
                          name="Answered"
                        />
                      </BarChart>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Call Statistics by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This table summarizes call statistics for each agent,
                      including totals, answered, answer rate, durations,
                      and talk time.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Total Calls</TableHead>
                            <TableHead>Answered</TableHead>
                            <TableHead>Answer Rate (%)</TableHead>
                            <TableHead>Avg Duration </TableHead>
                            <TableHead>Total Talk Time </TableHead>
                            <TableHead>Shortest Call </TableHead>
                            <TableHead>Longest Call </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAgentPerf.map((row) => (
                            <TableRow key={row.ext}>
                              <TableCell>
                                {row.name || `(${row.ext})`}
                              </TableCell>
                              <TableCell>{row.totalCalls}</TableCell>
                              <TableCell>{row.answeredCount}</TableCell>
                              <TableCell>{row.answerRate}</TableCell>
                              <TableCell>{row.avgCallDuration}</TableCell>
                              <TableCell>{row.totalTalkTime}</TableCell>
                              <TableCell>{row.shortestCall}</TableCell>
                              <TableCell>{row.longestCall}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>,

            // SLA Compliance Tab
            <div key="sla-compliance" className="space-y-6">
              <div className="flex justify-end mb-2">
                <button
                  className="px-3 py-1 rounded border text-sm font-medium bg-white hover:bg-gray-100"
                  onClick={() => setShowSLATable((v) => !v)}
                >
                  {showSLATable ? "Show Chart" : "Show Table"}
                </button>
              </div>
              {!showSLATable ? (
                <Card>
                  <CardHeader>
                    <CardTitle>SLA Compliance by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This chart shows the percentage of calls answered within SLA for each agent. Bar color indicates performance.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredResponseTime.map((row) => (
                        <div
                          key={row.ext}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-32 text-sm font-medium">
                            {row.name || ` (${row.ext})`}
                          </div>
                          <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden relative">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${row.slaCompliance || 0}%`,
                                background: getSlaColor(row.slaCompliance),
                                transition: "width 0.5s",
                              }}
                            />
                          </div>
                          <div className="w-16 text-right text-sm font-semibold">
                            {row.slaCompliance !== null
                              ? `${row.slaCompliance}%`
                              : "-"}
                          </div>
                        </div>
                      ))}
                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#22c55e'}}></span><span className="text-xs">≥ 90%</span></div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#eab308'}}></span><span className="text-xs">70–89%</span></div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#f59e42'}}></span><span className="text-xs">50–69%</span></div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#ef4444'}}></span><span className="text-xs">30–49%</span></div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full inline-block" style={{background:'#991b1b'}}></span><span className="text-xs">&lt; 30%</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>SLA Compliance by Agent</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      This table summarizes SLA compliance for each agent.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Agent</TableHead>
                            <TableHead>Total Incoming</TableHead>
                            <TableHead>Answered Incoming</TableHead>
                            <TableHead>Avg Response Time </TableHead>
                            <TableHead>Answered Within SLA</TableHead>
                            <TableHead>SLA Compliance (%)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredResponseTime.map((row) => (
                            <TableRow key={row.ext}>
                              <TableCell>
                                {row.name || `(${row.ext})`}
                              </TableCell>
                              <TableCell>{row.totalIncomingCalls}</TableCell>
                              <TableCell>{row.answeredIncomingCalls}</TableCell>
                              <TableCell>
                                {row.avgResponseTime !== null
                                  ? row.avgResponseTime
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                {row.callsAnsweredWithinSLA}
                              </TableCell>
                              <TableCell>
                                {row.slaCompliance !== null
                                  ? row.slaCompliance
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>,
          ]}
        />
      )}
    </div>
  );
};

export default UserActivityAnalytics;
