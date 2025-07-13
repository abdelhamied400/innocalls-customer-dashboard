"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, LabelList } from "recharts";

interface AnswerRateData {
  timeSlot: string;
  answerRate: number;
  totalCalls: number;
  answeredCalls: number;
}

interface OutboundAnswerRateChartProps {
  data: AnswerRateData[];
}

const OutboundAnswerRateChart: React.FC<OutboundAnswerRateChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Time Slot: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Answer Rate: ${data.answerRate}%`}</p>
          <p className="text-gray-600 text-sm">{`Total Calls: ${data.totalCalls}`}</p>
          <p className="text-green-600 text-sm">{`Answered: ${data.answeredCalls}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 5} textAnchor="middle" fill="#6B7280" fontSize={12}>
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="timeSlot" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="answerRate" 
            fill="#8B5CF6" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList dataKey="answerRate" content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OutboundAnswerRateChart; 