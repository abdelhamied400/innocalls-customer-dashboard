"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface IvrOption {
  optionNumber: number;
  clickCount: number;
  optionName?: string;
}

interface IvrDistributionData {
  ivrName: string;
  options: IvrOption[];
}

interface IvrDistributionChartProps {
  data: IvrDistributionData[];
}

const IvrDistributionChart: React.FC<IvrDistributionChartProps> = ({ data }) => {
  // Transform data for chart display
  const chartData = data.map(ivr => {
    const optionData: any = { ivrName: ivr.ivrName };
    ivr.options.forEach(option => {
      optionData[`option${option.optionNumber}`] = option.clickCount;
    });
    return optionData;
  });

  // Generate colors for options
  const colors = ['#3B82F6', '#10B981', '#F59E42', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="ivrName" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            label={{ value: "IVR Name", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip />
          <Legend />
          {data[0]?.options.map((option, index) => (
            <Bar 
              key={option.optionNumber}
              dataKey={`option${option.optionNumber}`} 
              fill={colors[index % colors.length]} 
              radius={[4, 4, 0, 0]} 
              name={`Option ${option.optionNumber}${option.optionName ? ` - ${option.optionName}` : ''}`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IvrDistributionChart; 