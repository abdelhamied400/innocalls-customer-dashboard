"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

interface TalkTimeBarChartProps {
  data: { timeBucket: string; totalCalls: number }[];
}

const TalkTimeBarChart: React.FC<TalkTimeBarChartProps> = ({ data }) => (
  <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="timeBucket" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="totalCalls" fill="#10B981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TalkTimeBarChart; 