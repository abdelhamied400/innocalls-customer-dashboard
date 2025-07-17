import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface OutboundCallDistributionLineChartProps {
  data: {
    date: string;
    totalOutboundCalls: number;
    unansweredCalls: number;
    totalOutboundInternal: number;
    totalOutboundExternal:  number;
    internalUnanswered:  number;
    externalUnanswered:  number;

  }[];
}

const OutboundCallDistributionLineChart: React.FC<OutboundCallDistributionLineChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Call Distribution </CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="internal" stroke="#3b82f6" strokeWidth={2} dot={false} name="Internal" />
            <Line type="monotone" dataKey="external" stroke="#F59E42" strokeWidth={2} dot={false} name="External" />
            <Line type="monotone" dataKey="unanswered" stroke="#EF4444" strokeWidth={2} dot={false} name="Unanswered" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default OutboundCallDistributionLineChart; 