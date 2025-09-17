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
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface TalkTimeBarChartProps {
  data: { timeBucket: string; totalCalls: number }[];
}

const TalkTimeBarChart: React.FC<TalkTimeBarChartProps> = ({ data }) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timeBucket"
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
          <Tooltip contentStyle={{ direction: locale.dir }} />
          <Bar dataKey="totalCalls" fill="#10B981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TalkTimeBarChart;
