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

interface AvailabilityData {
  hour: number;
  availableUsers: number;
  totalUsers: number;
  availabilityRate: number;
}

interface UserAvailabilityChartProps {
  data: AvailabilityData[];
}

const UserAvailabilityChart: React.FC<UserAvailabilityChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];
  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const hourData = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Hour: ${formatHour(
            label
          )}`}</p>
          <p className="text-blue-600 text-sm">{`Available Users: ${hourData.availableUsers}`}</p>
          <p className="text-gray-600 text-sm">{`Total Users: ${hourData.totalUsers}`}</p>
          <p className="text-green-600 text-sm">{`Availability Rate: ${hourData.availabilityRate}%`}</p>
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
            dataKey="hour"
            tickFormatter={formatHour}
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
          <YAxis
            yAxisId={1}
            orientation="right"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            content={<CustomTooltip />}
          />

          <Line
            type="monotone"
            dataKey="availableUsers"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", r: 4 }}
            name="Available Users"
          />
          <Line
            type="monotone"
            dataKey="availabilityRate"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", r: 4 }}
            name="Availability Rate (%)"
            yAxisId={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserAvailabilityChart;
