import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";

const OutboundCallDistributionLineChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Call Distribution </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} label={{ value: "Date", position: "insideBottomRight", offset: -5 }} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalOutboundCalls" stroke="#6366F1" strokeWidth={2.5} dot={false} name="All" />
            <Line type="monotone" dataKey="unansweredCalls" stroke="#EF4444" strokeWidth={2.5} dot={false} name="Unanswered" />
            <Line type="monotone" dataKey="totalOutboundInternal" stroke="#10B981" strokeWidth={2} dot={false} name="Internal" />
            <Line type="monotone" dataKey="totalOutboundExternal" stroke="#F59E42" strokeWidth={2} dot={false} name="External" />
            <Line type="monotone" dataKey="internalUnanswered" stroke="#6366F1" strokeWidth={1.5} dot={false} name="Internal Unanswered" />
            <Line type="monotone" dataKey="externalUnanswered" stroke="#F59E42" strokeWidth={1.5} dot={false} name="External Unanswered" />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default OutboundCallDistributionLineChart; 