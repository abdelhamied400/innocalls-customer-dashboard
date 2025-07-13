"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface AbandonedCallsData {
  totalAbandonedCalls: number;
  uniqueCallersAbandoned: number;
  queuesWithAbandons: number;
  avgWaitTimeBeforeAbandon: number;
  minWaitTimeBeforeAbandon: number;
  maxWaitTimeBeforeAbandon: number;
  avgInitialQueuePosition: number;
  minInitialQueuePosition: number;
  maxInitialQueuePosition: number;
  quickAbandons_0_10s: number;
  shortWait_11_30s: number;
  mediumWait_31_60s: number;
  longWait_1_2min: number;
  veryLongWait_2min_plus: number;
  peakAbandonHour: number;
}

interface AbandonedCallsChartProps {
  data: AbandonedCallsData;
}

const AbandonedCallsChart: React.FC<AbandonedCallsChartProps> = ({ data }) => {
  const waitTimeDistribution = [
    { name: "0-10s", value: data.quickAbandons_0_10s, color: "#EF4444" },
    { name: "11-30s", value: data.shortWait_11_30s, color: "#F59E42" },
    { name: "31-60s", value: data.mediumWait_31_60s, color: "#FBBF24" },
    { name: "1-2min", value: data.longWait_1_2min, color: "#10B981" },
    { name: "2min+", value: data.veryLongWait_2min_plus, color: "#3B82F6" },
  ];

  const queueStats = [
    { name: "Avg Wait Time", value: `${Math.floor(data.avgWaitTimeBeforeAbandon / 60)}:${(data.avgWaitTimeBeforeAbandon % 60).toString().padStart(2, '0')}` },
    { name: "Min Wait Time", value: `${Math.floor(data.minWaitTimeBeforeAbandon / 60)}:${(data.minWaitTimeBeforeAbandon % 60).toString().padStart(2, '0')}` },
    { name: "Max Wait Time", value: `${Math.floor(data.maxWaitTimeBeforeAbandon / 60)}:${(data.maxWaitTimeBeforeAbandon % 60).toString().padStart(2, '0')}` },
    { name: "Avg Queue Position", value: data.avgInitialQueuePosition.toFixed(1) },
    { name: "Peak Abandon Hour", value: `${data.peakAbandonHour}:00` },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-red-800">Total Abandoned</h3>
          <p className="text-2xl font-bold text-red-600">{data.totalAbandonedCalls}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-orange-800">Unique Callers</h3>
          <p className="text-2xl font-bold text-orange-600">{data.uniqueCallersAbandoned}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-blue-800">Queues Affected</h3>
          <p className="text-2xl font-bold text-blue-600">{data.queuesWithAbandons}</p>
        </div>
      </div>

      {/* Wait Time Distribution Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Wait Time Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={waitTimeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {waitTimeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Queue Statistics</h3>
          <div className="space-y-3">
            {queueStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-medium">{stat.name}</span>
                <span className="text-blue-600 font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonedCallsChart; 