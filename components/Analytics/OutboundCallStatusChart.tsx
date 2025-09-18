"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

interface CallStatusData {
  name: string;
  count: number;
  percentage: number;
}

interface OutboundCallStatusChartProps {
  data: CallStatusData[];
}

const OutboundCallStatusChart = ({ data }: OutboundCallStatusChartProps) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  return (
    <div className="h-80">
      <PieChart width={400} height={320}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={({ fill, name, count, x, y, textAnchor }) => (
            <text
              x={x}
              y={y}
              fill={fill}
              textAnchor={textAnchor === "start" ? "end" : "start"}
              dominantBaseline="central"
            >
              {`${name}: ${count}`}
            </text>
          )}
          outerRadius={100}
          fill="#2563EB"
          dataKey="count"
        >
          {data &&
            data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
        </Pie>
        <Tooltip contentStyle={{ direction: locale.dir }} />
      </PieChart>
    </div>
  );
};

export default OutboundCallStatusChart;
