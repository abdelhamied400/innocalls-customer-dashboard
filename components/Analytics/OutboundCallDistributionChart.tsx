import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface OutboundCallDistributionLineChartProps {
  data: {
    date: string;
    totalOutboundCalls: number;
    unansweredCalls: number;
    totalOutboundInternal: number;
    totalOutboundExternal: number;
    internalUnanswered: number;
    externalUnanswered: number;
  }[];
}

const OutboundCallDistributionLineChart: React.FC<
  OutboundCallDistributionLineChartProps
> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Call Distribution </CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="totalOutboundCalls"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Total Out"
            />
            <Line
              type="monotone"
              dataKey="unansweredCalls"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={false}
              name="Unans. Total"
            />
            <Line
              type="monotone"
              dataKey="totalOutboundInternal"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Int. Outbound"
            />
            <Line
              type="monotone"
              dataKey="totalOutboundExternal"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              name="Ext. Outbound"
            />
            <Line
              type="monotone"
              dataKey="internalUnanswered"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
              name="Int. Unans."
            />
            <Line
              type="monotone"
              dataKey="externalUnanswered"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Ext. Unans."
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default OutboundCallDistributionLineChart;
