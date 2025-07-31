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

interface LoginActivityData {
  hour: number;
  logins: number;
  logouts: number;
  activeUsers: number;
}

interface UserLoginActivityChartProps {
  data: LoginActivityData[];
}

const UserLoginActivityChart: React.FC<UserLoginActivityChartProps> = ({
  data,
}) => {
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
          <p className="text-green-600 text-sm">{`Logins: ${hourData.logins}`}</p>
          <p className="text-red-600 text-sm">{`Logouts: ${hourData.logouts}`}</p>
          <p className="text-blue-600 text-sm">{`Active Users: ${hourData.activeUsers}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
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
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="logins"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", r: 4 }}
            name="Logins"
          />
          <Line
            type="monotone"
            dataKey="logouts"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: "#EF4444", r: 4 }}
            name="Logouts"
          />
          <Line
            type="monotone"
            dataKey="activeUsers"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", r: 4 }}
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserLoginActivityChart;
