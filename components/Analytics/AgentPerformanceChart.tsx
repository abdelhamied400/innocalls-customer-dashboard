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
  Legend,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface AgentPerformanceData {
  agentExt: number;
  callsHandled: number;
  avgWaitTime: string;
  avgTalkTime: string;
  totalWaitTime: string;
  totalTalkTime: string;
  minCustomerQueuePosition: number;
  maxCustomerPosition: number;
}

interface AgentPerformanceChartProps {
  data: AgentPerformanceData[];
}

const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  // Convert time strings to seconds for better visualization
  const processedData = data.map((item) => ({
    ...item,
    avgWaitTimeSec:
      parseFloat(item.avgWaitTime.split(":")[2]) +
      parseFloat(item.avgWaitTime.split(":")[1]) * 60 +
      parseFloat(item.avgWaitTime.split(":")[0]) * 3600,
    avgTalkTimeSec:
      parseFloat(item.avgTalkTime.split(":")[2]) +
      parseFloat(item.avgTalkTime.split(":")[1]) * 60 +
      parseFloat(item.avgTalkTime.split(":")[0]) * 3600,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="agentExt"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{
              value: "Agent Extension",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ direction: locale.dir }}
            formatter={(value, name) => {
              if (name === "avgWaitTimeSec")
                return [
                  `${Math.floor(Number(value) / 60)}:${(Number(value) % 60)
                    .toString()
                    .padStart(2, "0")}`,
                  "Avg Wait Time",
                ];
              if (name === "avgTalkTimeSec")
                return [
                  `${Math.floor(Number(value) / 60)}:${(Number(value) % 60)
                    .toString()
                    .padStart(2, "0")}`,
                  "Avg Talk Time",
                ];
              return [value, name];
            }}
          />

          <Bar
            dataKey="callsHandled"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Calls Handled"
          />
          <Bar
            dataKey="avgWaitTimeSec"
            fill="#F59E42"
            radius={[4, 4, 0, 0]}
            name="Avg Wait Time"
          />
          <Bar
            dataKey="avgTalkTimeSec"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            name="Avg Talk Time"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgentPerformanceChart;
