"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import DateRangeSearch from "@/components/Analytics/DateRangeSearch";
import AnalyticsTabs from "@/components/Analytics/AnalyticsTabs";
import UserStatusChart from "@/components/Analytics/UserStatusChart";
import UserActivityTimelineChart from "@/components/Analytics/UserActivityTimelineChart";
import UserCallMetricsChart from "@/components/Analytics/UserCallMetricsChart";
import UserPerformanceChart from "@/components/Analytics/UserPerformanceChart";
import UserAvailabilityChart from "@/components/Analytics/UserAvailabilityChart";
import UserLoginActivityChart from "@/components/Analytics/UserLoginActivityChart";
import { BarChart3, Users, Clock, Activity, TrendingUp, UserCheck, Calendar } from "lucide-react";
import { BarChart, XAxis, YAxis, Bar } from "recharts";



type UserCallVolume = {
  user: string;
  answeredInbound: number;
  connectedOutbound: number;
  outboundCalls: number;
  avgInCallTimeInbound: string;
  avgInCallTimeOutbound: string;
  inCallTimeInbound: string;
  inCallTimeOutbound: string;
};


// Function to generate user activity data
const generateUserActivityData = (fromDate: Date, toDate: Date) => {
  const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  const multiplier = Math.max(1, daysDiff / 7);

  // Generate user status data
  const userStatusData = [
    { status: "Online", count: Math.floor(12 * multiplier), color: "#10B981" },
    { status: "Busy", count: Math.floor(8 * multiplier), color: "#F59E0B" },
    { status: "Away", count: Math.floor(5 * multiplier), color: "#EF4444" },
    { status: "Offline", count: Math.floor(15 * multiplier), color: "#6B7280" },
    { status: "Break", count: Math.floor(3 * multiplier), color: "#8B5CF6" },
  ];

  // Generate daily activity timeline
  const activityTimeline = [];
  for (let i = 0; i < Math.min(daysDiff, 30); i++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + i);
    activityTimeline.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      activeUsers: Math.floor(Math.random() * 20) + 10,
      totalLogins: Math.floor(Math.random() * 35) + 15,
      avgSessionTime: Math.floor(Math.random() * 240) + 120, // 2-6 hours
      peakHour: Math.floor(Math.random() * 8) + 9, // 9 AM - 5 PM
    });
  }

  // Generate user call metrics
  const userCallMetrics = [
    { 
      userId: "1001", 
      name: "Ahmed Rabiea", 
      totalCalls: Math.floor(45 * multiplier), 
      answeredCalls: Math.floor(38 * multiplier),
      missedCalls: Math.floor(7 * multiplier),
      avgCallDuration: Math.floor(Math.random() * 180) + 60,
      totalTalkTime: Math.floor(Math.random() * 480) + 120,
      availability: Math.floor(Math.random() * 30) + 70, // 70-100%
      status: "Online"
    },
    { 
      userId: "1002", 
      name: "Shaimaa	", 
      totalCalls: Math.floor(52 * multiplier), 
      answeredCalls: Math.floor(44 * multiplier),
      missedCalls: Math.floor(8 * multiplier),
      avgCallDuration: Math.floor(Math.random() * 180) + 60,
      totalTalkTime: Math.floor(Math.random() * 480) + 120,
      availability: Math.floor(Math.random() * 30) + 70,
      status: "Busy"
    },
    { 
      userId: "1003", 
      name: "Goda", 
      totalCalls: Math.floor(38 * multiplier), 
      answeredCalls: Math.floor(32 * multiplier),
      missedCalls: Math.floor(6 * multiplier),
      avgCallDuration: Math.floor(Math.random() * 180) + 60,
      totalTalkTime: Math.floor(Math.random() * 480) + 120,
      availability: Math.floor(Math.random() * 30) + 70,
      status: "Away"
    },
    { 
      userId: "1004", 
      name: "Aml", 
      totalCalls: Math.floor(48 * multiplier), 
      answeredCalls: Math.floor(41 * multiplier),
      missedCalls: Math.floor(7 * multiplier),
      avgCallDuration: Math.floor(Math.random() * 180) + 60,
      totalTalkTime: Math.floor(Math.random() * 480) + 120,
      availability: Math.floor(Math.random() * 30) + 70,
      status: "Online"
    },
    { 
      userId: "1005", 
      name: "A. Abdullah", 
      totalCalls: Math.floor(42 * multiplier), 
      answeredCalls: Math.floor(36 * multiplier),
      missedCalls: Math.floor(6 * multiplier),
      avgCallDuration: Math.floor(Math.random() * 180) + 60,
      totalTalkTime: Math.floor(Math.random() * 480) + 120,
      availability: Math.floor(Math.random() * 30) + 70,
      status: "Break"
    },
  ];

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

  // Generate login activity data
  const loginActivity = [];
  for (let hour = 0; hour < 24; hour++) {
    loginActivity.push({
      hour: hour,
      logins: Math.floor(Math.random() * 8) + 1,
      logouts: Math.floor(Math.random() * 6) + 1,
      activeUsers: Math.floor(Math.random() * 20) + 5,
    });
  }

  // Generate performance metrics
  const performanceMetrics = [
    { metric: "Response Time", value: Math.floor(Math.random() * 30) + 10, unit: "sec", trend: "up" },
    { metric: "Call Quality", value: Math.floor(Math.random() * 20) + 80, unit: "%", trend: "up" },
    { metric: "Uptime", value: Math.floor(Math.random() * 10) + 95, unit: "%", trend: "stable" },
    { metric: "User Satisfaction", value: Math.floor(Math.random() * 15) + 85, unit: "%", trend: "up" },
  ];

  return {
    userStatusData,
    activityTimeline,
    userCallMetrics,
    hourlyAvailability,
    loginActivity,
    performanceMetrics,
  };
};

// Add new dummy data generator for user call volume
const generateUserCallVolumeData = () => [
  {
    user: "Ahmed Rabiea",
    answeredInbound: 84,
    connectedOutbound: 0,
    outboundCalls: 0,
    avgInCallTimeInbound: "00:04:18",
    avgInCallTimeOutbound: "00:00:00",
    inCallTimeInbound: "06:01:09",
    inCallTimeOutbound: "00:00:00"
  },
  {
    user: "Shaimaa	",
    answeredInbound: 47,
    connectedOutbound: 256,
    outboundCalls: 261,
    avgInCallTimeInbound: "00:16:18",
    avgInCallTimeOutbound: "00:34:57",
    inCallTimeInbound: "12:46:04",
    inCallTimeOutbound: "149:08:19"
  },
  {
    user: "A. Abdullah",
    answeredInbound: 41,
    connectedOutbound: 56,
    outboundCalls: 57,
    avgInCallTimeInbound: "00:17:30",
    avgInCallTimeOutbound: "00:45:39",
    inCallTimeInbound: "11:57:44",
    inCallTimeOutbound: "42:36:06"
  },
  {
    user: "Kamal",
    answeredInbound: 38,
    connectedOutbound: 156,
    outboundCalls: 156,
    avgInCallTimeInbound: "00:00:17",
    avgInCallTimeOutbound: "00:00:20",
    inCallTimeInbound: "00:10:44",
    inCallTimeOutbound: "00:51:39"
  },
  // ... add more users as needed ...
];

const UserActivityAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [callVolumeData, setCallVolumeData] = useState<UserCallVolume[]>([]);

  useEffect(() => {
    setIsClient(true);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    setData(generateUserActivityData(sevenDaysAgo, today));
    setCallVolumeData(generateUserCallVolumeData());
  }, []);

  const handleDateRangeChange = (fromDate: Date, toDate: Date) => {
    const newData = generateUserActivityData(fromDate, toDate);
    setData(newData);
  };

  // Calculate summary stats
  const totalUsers = data?.userStatusData?.reduce((sum: number, status: any) => sum + status.count, 0) || 0;
  const onlineUsers = data?.userStatusData?.find((s: any) => s.status === "Online")?.count || 0;
  const busyUsers = data?.userStatusData?.find((s: any) => s.status === "Busy")?.count || 0;
  const avgSessionTime = data?.activityTimeline ? Math.floor(data.activityTimeline.reduce((sum: number, day: any) => sum + day.avgSessionTime, 0) / data.activityTimeline.length) : 0;
  const avgSessionTimeFormatted = `${Math.floor(avgSessionTime / 60)}:${(avgSessionTime % 60).toString().padStart(2, '0')}`;
  const totalCalls = data?.userCallMetrics?.reduce((sum: number, user: any) => sum + user.totalCalls, 0) || 0;
  const answeredCalls = data?.userCallMetrics?.reduce((sum: number, user: any) => sum + user.answeredCalls, 0) || 0;

  const summaryStats = [
    { icon: "/assets/icons/stats/add-call.svg", title: "Total Users", value: totalUsers },
    { icon: "/assets/icons/stats/calendar.svg", title: "Online Users", value: onlineUsers },
    { icon: "/assets/icons/stats/erg/mini/ring_volume.svg", title: "Busy Users", value: busyUsers },
    { icon: "/assets/icons/stats/timer.svg", title: "Avg Session", value: avgSessionTimeFormatted },
    { icon: "/assets/icons/stats/erg/today.png", title: "Total Calls", value: totalCalls },
    { icon: "/assets/icons/stats/erg/date_range.png", title: "Answered Calls", value: answeredCalls },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    // { id: "activity", label: "Activity", icon: <Activity className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "call-volume", label: "Call Volume", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Date Range Search */}
      <DateRangeSearch onDateRangeChange={handleDateRangeChange} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {isClient && summaryStats.map((stat) => (
          <StatsCard
            key={stat.title}
            icon={<img src={stat.icon} alt="" className="w-6 h-6" />}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Analytics Tabs */}
      {isClient && data && (
        <AnalyticsTabs 
          tabs={tabs} 
          defaultTab="overview"
          children={[
            // Overview Tab
            <div key="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserStatusChart data={data.userStatusData} />
                  </CardContent>
                </Card>
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Daily Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserActivityTimelineChart data={data.activityTimeline} />
                  </CardContent>
                </Card> */}
              </div>
            </div>,

            // Activity Tab
            // <div key="activity" className="space-y-6">
            //   <Card>
            //     <CardHeader>
            //       <CardTitle>Hourly Availability</CardTitle>
            //     </CardHeader>
            //     <CardContent>
            //       <UserAvailabilityChart data={data.hourlyAvailability} />
            //     </CardContent>
            //   </Card>
            //   <Card>
            //     <CardHeader>
            //       <CardTitle>Login Activity (24 Hours)</CardTitle>
            //     </CardHeader>
            //     <CardContent>
            //       <UserLoginActivityChart data={data.loginActivity} />
            //     </CardContent>
            //   </Card>
            // </div>,

            // Users Tab
            <div key="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Call Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserCallMetricsChart data={data.userCallMetrics} />
                </CardContent>
              </Card>
              
              {/* User Details Table */}
              <Card>
                <CardHeader>
                  <CardTitle>User Performance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Total Calls</th>
                          <th className="text-left p-2">Answered</th>
                          <th className="text-left p-2">Missed</th>
                          <th className="text-left p-2">Answer Rate</th>
                          <th className="text-left p-2">Avg Duration</th>
                          {/* <th className="text-left p-2">Availability</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {data.userCallMetrics.map((user:any) => (
                          <tr key={user.userId} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{user.name}</td>
                            <td className="p-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.status === 'Online' ? 'bg-green-100 text-green-800' :
                                user.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                                user.status === 'Away' ? 'bg-red-100 text-red-800' :
                                user.status === 'Break' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="p-2">{user.totalCalls}</td>
                            <td className="p-2 text-green-600">{user.answeredCalls}</td>
                            <td className="p-2 text-red-600">{user.missedCalls}</td>
                            <td className="p-2">{Math.round((user.answeredCalls / user.totalCalls) * 100)}%</td>
                            <td className="p-2">{`${Math.floor(user.avgCallDuration / 60)}:${(user.avgCallDuration % 60).toString().padStart(2, '0')}`}</td>
                            {/* <td className="p-2">{user.availability}%</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>,

            // Call Volume Tab
            <div key="call-volume" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Answered Inbound Calls per User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart width={400} height={300} data={callVolumeData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="user" type="category" width={120} />
                      <Bar dataKey="answeredInbound" fill="#10B981" />
                    </BarChart>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Outbound Calls per User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart width={400} height={300} data={callVolumeData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="user" type="category" width={120} />
                      <Bar dataKey="connectedOutbound" fill="#2563EB" />
                    </BarChart>
                  </CardContent>
                </Card>
              </div>
            </div>,
          ]}
        />
      )}
    </div>
  );
};

export default UserActivityAnalytics; 