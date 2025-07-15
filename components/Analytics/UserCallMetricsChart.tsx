"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface UserCallMetricsData {
  userId: string;
  name: string;
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  avgCallDuration: number;
  totalTalkTime: number;
  availability: number;
  status: string;
}

interface UserCallMetricsChartProps {
  data: UserCallMetricsData[];
}

const UserCallMetricsChart: React.FC<UserCallMetricsChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const user = payload[0].payload;
      const answerRate = Math.round((user.answeredCalls / user.totalCalls) * 100);
      const avgDurationFormatted = `${Math.floor(user.avgCallDuration / 60)}:${(user.avgCallDuration % 60).toString().padStart(2, '0')}`;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`User: ${label}`}</p>
          <p className="text-blue-600 text-sm">{`Total Calls: ${user.totalCalls}`}</p>
          <p className="text-green-600 text-sm">{`Answered: ${user.answeredCalls}`}</p>
          <p className="text-red-600 text-sm">{`Missed: ${user.missedCalls}`}</p>
          <p className="text-purple-600 text-sm">{`Answer Rate: ${answerRate}%`}</p>
          <p className="text-orange-600 text-sm">{`Avg Duration: ${avgDurationFormatted}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#6B7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
            tick={{ fill: '#6B7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
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
          <Bar 
            dataKey="missedCalls" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]}
            name="Missed Calls"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserCallMetricsChart; 