"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { useLocale } from "@/providers/TranslationProvider";
import { defaultLocale, locales } from "@/i18n/config";

interface PerformanceMetricData {
  metric: string;
  value: number;
  unit: string;
  trend: string;
}

interface UserPerformanceChartProps {
  data: PerformanceMetricData[];
}

const UserPerformanceChart: React.FC<UserPerformanceChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const metric = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Metric: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Value: ${metric.value}${metric.unit}`}</p>
          <p className="text-green-600 text-sm">{`Trend: ${metric.trend}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, value, payload } = props;
    // Get the unit from the data object
    const unit = payload?.payload?.unit || "";
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        fill="#6B7280"
        fontSize={12}
      >
        {`${value}${unit}`}
      </text>
    );
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="metric"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="value" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserPerformanceChart;
