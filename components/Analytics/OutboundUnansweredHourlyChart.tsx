import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const OutboundUnansweredHourlyChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Hourly Internal vs External Unanswered</CardTitle>
    </CardHeader>
    <CardContent>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="hour" tickFormatter={h => `${h}:00`} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="internal" stackId="a" fill="#3b82f6" name="Internal Unanswered" />
            <Bar dataKey="external" stackId="a" fill="#9CA3AF" name="External Unanswered" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default OutboundUnansweredHourlyChart; 