import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import RechartTooltip from "../RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { useLocale } from "@/providers/TranslationProvider";

interface OutboundUnansweredHourlyChartProps {
  data: any;
  barColors?: {
    internal: string;
    external: string;
  };
}

const OutboundUnansweredHourlyChart: React.FC<
  OutboundUnansweredHourlyChartProps
> = ({ data, barColors }) => {
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Internal vs External Unanswered</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer style={{ direction: "ltr" }}>
            <BarChart data={data}>
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis />
              <Tooltip contentStyle={{ direction: locale.dir }} />

              <Bar
                dataKey="internal"
                stackId="a"
                fill={barColors?.internal || "#3b82f6"} // blue-500 default
                name="Internal Unanswered"
              />
              <Bar
                dataKey="external"
                stackId="a"
                fill={barColors?.external || "#9CA3AF"} // orange-400 default
                name="External Unanswered"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutboundUnansweredHourlyChart;
