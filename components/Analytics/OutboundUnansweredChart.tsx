"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, BarChart, Bar } from "recharts";

interface OutboundUnansweredData {
  date: string;
  totalOutboundCalls: number;
  unansweredCalls: number;
}

interface OutboundUnansweredChartProps {
  data: OutboundUnansweredData[];
}

const OutboundUnansweredChart: React.FC<OutboundUnansweredChartProps> = ({ data }) => {
  const totalUnanswered = data.reduce((sum, day) => sum + day.unansweredCalls, 0);
  const totalOutbound = data.reduce((sum, day) => sum + day.totalOutboundCalls, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-blue-800">Total Outbound</h3>
          <p className="text-2xl font-bold text-blue-600">{totalOutbound}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-red-800">Total Unanswered</h3>
          <p className="text-2xl font-bold text-red-600">{totalUnanswered}</p>
        </div>
      </div>

      {/* Daily Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Daily Unanswered Calls</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="unansweredCalls" stroke="#EF4444" strokeWidth={3} dot={{ fill: "#EF4444", r: 4 }} />
                <Line type="monotone" dataKey="totalOutboundCalls" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Daily Unanswered Calls (Bar Chart)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="unansweredCalls" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Details Table */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Daily Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Total Outbound</th>
                <th className="text-left p-2">Unanswered</th>
                {/* <th className="text-left p-2">Answered</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((day, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{day.date}</td>
                  <td className="p-2">{day.totalOutboundCalls}</td>
                  <td className="p-2 text-red-600 font-semibold">{day.unansweredCalls}</td>
                  {/* <td className="p-2 text-green-600">{day.totalOutboundCalls - day.unansweredCalls}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutboundUnansweredChart; 