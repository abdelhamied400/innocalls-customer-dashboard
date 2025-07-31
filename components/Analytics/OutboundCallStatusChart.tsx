"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface CallStatusData {
  name: string;
  count: number;
  percentage: number;
}

interface OutboundCallStatusChartProps {
  data: CallStatusData[];
}

const OutboundCallStatusChart = ({ data }: OutboundCallStatusChartProps) => (
  <div className="h-80">
    <PieChart width={400} height={320}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, count }) => `${name}: ${count}`}
        outerRadius={100}
        fill="#2563EB"
        dataKey="count"
      >
        {data &&
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
);

export default OutboundCallStatusChart;
