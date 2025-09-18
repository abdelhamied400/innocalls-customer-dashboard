"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface ActivityTimelineData {
  date: string;
  activeUsers: number;
  totalLogins: number;
  avgSessionTime: number;
  peakHour: number;
}

interface UserActivityTimelineChartProps {
  data: ActivityTimelineData[];
}

const UserActivityTimelineChart: React.FC<UserActivityTimelineChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      const sessionTimeFormatted = `${Math.floor(
        dayData.avgSessionTime / 60
      )}:${(dayData.avgSessionTime % 60).toString().padStart(2, "0")}`;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Date: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Active Users: ${dayData.activeUsers}`}</p>
          <p className="text-green-600 text-sm">{`Total Logins: ${dayData.totalLogins}`}</p>
          <p className="text-purple-600 text-sm">{`Avg Session: ${sessionTimeFormatted}`}</p>
          <p className="text-orange-600 text-sm">{`Peak Hour: ${dayData.peakHour}:00`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer
        style={{ direction: "ltr" }}
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            content={<CustomTooltip />}
          />

          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", r: 4 }}
            name="Active Users"
          />
          <Line
            type="monotone"
            dataKey="totalLogins"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", r: 4 }}
            name="Total Logins"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityTimelineChart;
