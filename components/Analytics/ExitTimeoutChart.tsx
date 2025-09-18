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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface ExitTimeoutData {
  totalTimeoutCalls: number;
  uniqueCallersTimeout: number;
  queuesWithTimeouts: number;
  avgWaitTimeBeforeTimeout: number;
  minWaitTimeBeforeTimeout: number;
  maxWaitTimeBeforeTimeout: number;
  avgInitialQueuePosition: number;
  minInitialQueuePosition: number;
  maxInitialQueuePosition: number;
  quickTimeouts_0_10s: number;
  shortWait_11_30s: number;
  mediumWait_31_60s: number;
  longWait_1_2min: number;
  veryLongWait_2min_plus: number;
  peakTimeoutHour: number;
}

interface ExitTimeoutChartProps {
  data: ExitTimeoutData;
}

const ExitTimeoutChart: React.FC<ExitTimeoutChartProps> = ({ data }) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];
  const waitTimeDistribution = [
    { name: "0-10s", value: data.quickTimeouts_0_10s, color: "#EF4444" },
    { name: "11-30s", value: data.shortWait_11_30s, color: "#F59E42" },
    { name: "31-60s", value: data.mediumWait_31_60s, color: "#FBBF24" },
    { name: "1-2min", value: data.longWait_1_2min, color: "#10B981" },
    { name: "2min+", value: data.veryLongWait_2min_plus, color: "#3B82F6" },
  ];

  const queueStats = [
    {
      name: "Avg Wait Time",
      value: `${Math.floor(data.avgWaitTimeBeforeTimeout / 60)}:${(
        data.avgWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Min Wait Time",
      value: `${Math.floor(data.minWaitTimeBeforeTimeout / 60)}:${(
        data.minWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Max Wait Time",
      value: `${Math.floor(data.maxWaitTimeBeforeTimeout / 60)}:${(
        data.maxWaitTimeBeforeTimeout % 60
      )
        .toString()
        .padStart(2, "0")}`,
    },
    {
      name: "Avg Queue Position",
      value: data.avgInitialQueuePosition.toFixed(1),
    },
    { name: "Peak Timeout Hour", value: `${data.peakTimeoutHour}:00` },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-purple-800">
            Total Timeouts
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {data.totalTimeoutCalls}
          </p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-indigo-800">
            Unique Callers
          </h3>
          <p className="text-2xl font-bold text-indigo-600">
            {data.uniqueCallersTimeout}
          </p>
        </div>
        <div className="bg-cyan-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-cyan-800">
            Queues Affected
          </h3>
          <p className="text-2xl font-bold text-cyan-600">
            {data.queuesWithTimeouts}
          </p>
        </div>
      </div>

      {/* Wait Time Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Wait Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer
              style={{ direction: "ltr" }}
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={waitTimeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ fill, name, value, x, y, textAnchor }) => (
                    <text
                      x={x}
                      y={y}
                      fill={fill}
                      textAnchor={textAnchor === "start" ? "end" : "start"}
                      dominantBaseline="central"
                    >
                      {`${name}: ${value}`}
                    </text>
                  )}
                >
                  {waitTimeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ direction: locale.dir }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Queue Statistics</h3>
          <div className="space-y-3">
            {queueStats.map((stat, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="font-medium">{stat.name}</span>
                <span className="text-purple-600 font-semibold">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitTimeoutChart;
