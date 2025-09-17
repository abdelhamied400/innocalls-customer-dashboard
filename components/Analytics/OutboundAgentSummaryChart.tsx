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
import { useLocale } from "@/providers/TranslationProvider";
import { defaultLocale, locales } from "@/i18n/config";

interface AgentData {
  agentExt: string;
  totalCalls: number;
  answeredCalls: number;
  avgDuration: number;
}

interface OutboundAgentSummaryChartProps {
  data: AgentData[];
}

const OutboundAgentSummaryChart: React.FC<OutboundAgentSummaryChartProps> = ({
  data,
}) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const agent = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Agent: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Total Calls: ${agent.totalCalls}`}</p>
          <p className="text-green-600 text-sm">{`Answered: ${agent.answeredCalls}`}</p>
          <p className="text-purple-600 text-sm">{`Answer Rate: ${Math.round(
            (agent.answeredCalls / agent.totalCalls) * 100
          )}%`}</p>
          <p className="text-orange-600 text-sm">{`Avg Duration: ${Math.floor(
            agent.avgDuration / 60
          )}:${(agent.avgDuration % 60).toString().padStart(2, "0")}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
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
            dataKey="totalCalls"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Total Calls"
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

export default OutboundAgentSummaryChart;
