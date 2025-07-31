"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface CallDistributionLineChartProps {
  data: {
    hourOfDay: number;
    totalCalls: number;
    completedCalls: number;
    abandonedCalls: number;
    timeoutCalls: number;
  }[];
}

const CallDistributionLineChart: React.FC<CallDistributionLineChartProps> = ({
  data,
}) => (
  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="hourOfDay"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ value: "Hour", position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="totalCalls"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="completedCalls"
          stroke="#10B981"
          strokeWidth={3}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="abandonedCalls"
          stroke="#F59E42"
          strokeWidth={3}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="timeoutCalls"
          stroke="#EF4444"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default CallDistributionLineChart;
