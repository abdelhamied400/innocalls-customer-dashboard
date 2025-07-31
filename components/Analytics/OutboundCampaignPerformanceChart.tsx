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

interface CampaignPerformanceData {
  campaignName: string;
  totalCalls: number;
  answeredCalls: number;
  conversionRate: number;
  avgTalkTime: string;
  totalRevenue: number;
}

interface OutboundCampaignPerformanceChartProps {
  data: CampaignPerformanceData[];
}

const OutboundCampaignPerformanceChart: React.FC<
  OutboundCampaignPerformanceChartProps
> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const campaign = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Campaign: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Total Calls: ${campaign.totalCalls}`}</p>
          <p className="text-green-600 text-sm">{`Answered: ${campaign.answeredCalls}`}</p>
          <p className="text-purple-600 text-sm">{`Answer Rate: ${campaign.conversionRate}%`}</p>
          <p className="text-orange-600 text-sm">{`Avg Talk Time: ${campaign.avgTalkTime}`}</p>
          {campaign.totalRevenue > 0 && (
            <p className="text-green-600 text-sm">{`Revenue: $${campaign.totalRevenue.toLocaleString()}`}</p>
          )}
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
            dataKey="campaignName"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6B7280" }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: "#6B7280" }}
          />
          <Tooltip content={<CustomTooltip />} />

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

export default OutboundCampaignPerformanceChart;
