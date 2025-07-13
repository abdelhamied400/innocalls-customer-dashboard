"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LabelList } from "recharts";

interface TalkTimeData {
  timeBucket: string;
  totalCalls: number;
}

interface OutboundTalkTimeChartProps {
  data: TalkTimeData[];
}

const OutboundTalkTimeChart: React.FC<OutboundTalkTimeChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Duration: ${label}`}</p>
          <p className="text-orange-600 text-sm">{`Total Calls: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 5} textAnchor="middle" fill="#6B7280" fontSize={12}>
        {value}
      </text>
    );
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timeBucket" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="totalCalls" 
            fill="#F59E0B" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList dataKey="totalCalls" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutboundTalkTimeChart; 