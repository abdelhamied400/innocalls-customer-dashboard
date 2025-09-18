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
  callsMade: number;
  answeredCalls: number;
  avgTalkTime: string;
  conversionRate: number;
  totalTalkTime: string;
}

interface OutboundAgentPerformanceChartProps {
  data: AgentPerformanceData[];
}

const OutboundAgentPerformanceChart: React.FC<
  OutboundAgentPerformanceChartProps
> = ({ data }) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const agent = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Agent: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Calls Made: ${agent.callsMade}`}</p>
          <p className="text-green-600 text-sm">{`Answered: ${agent.answeredCalls}`}</p>
          <p className="text-purple-600 text-sm">{`Answer Rate: ${agent.conversionRate}%`}</p>
          <p className="text-orange-600 text-sm">{`Avg Talk Time: ${agent.avgTalkTime}`}</p>
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
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="agentExt"
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

          <Bar
            dataKey="callsMade"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Calls Made"
          />
          <Bar
            dataKey="answeredCalls"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            name="Answered Calls"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutboundAgentPerformanceChart;
