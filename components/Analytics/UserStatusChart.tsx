"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface UserStatusData {
  status: string;
  count: number;
  color: string;
}

interface UserStatusChartProps {
  data: UserStatusData[];
}

const UserStatusChart: React.FC<UserStatusChartProps> = ({ data }) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const payloadData = payload[0].payload;
      const total = data.reduce(
        (sum: number, item: UserStatusData) => sum + item.count,
        0
      );
      const percentage = Math.round((payloadData.count / total) * 100);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Status: ${payloadData.status}`}</p>
          <p className="text-sm" style={{ color: payloadData.color }}>
            {`Users: ${payloadData.count}`}
          </p>
          <p className="text-sm" style={{ color: payloadData.color }}>
            {`Percentage: ${percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, count }) => `${status}: ${count}`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            content={<CustomTooltip />}
          />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStatusChart;
