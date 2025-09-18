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

interface CallTrendData {
  hourOfDay: number;
  totalCalls: number;
  answeredCalls: number;
  unansweredCalls: number;
  avgTalkTime: string;
}

interface OutboundCallTrendsChartProps {
  data: CallTrendData[];
}

const OutboundCallTrendsChart: React.FC<OutboundCallTrendsChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Hour: ${formatHour(
            label
          )}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
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
            dataKey="hourOfDay"
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
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            content={<CustomTooltip />}
          />

          <Line
            type="monotone"
            dataKey="totalCalls"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: "#3B82F6", r: 4 }}
            name="Total Calls"
          />
          <Line
            type="monotone"
            dataKey="answeredCalls"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", r: 4 }}
            name="Answered Calls"
          />
          <Line
            type="monotone"
            dataKey="unansweredCalls"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: "#EF4444", r: 4 }}
            name="Unanswered Calls"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutboundCallTrendsChart;
