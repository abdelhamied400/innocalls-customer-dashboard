import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { UnAnsweredAnalyticsFilters } from "./page";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import { GroupIcon } from "lucide-react";
import NoData from "@/components/Analytics/NoData";

type InboundUnansweredHourlyProps = {
  filters: UnAnsweredAnalyticsFilters;
};
const InboundUnansweredHourly = ({ filters }: InboundUnansweredHourlyProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inboundUnansweredHourly", filters],
    queryFn: () =>
      unansweredAnalyticsService.fetchInboundUnansweredHourly(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Inbound Distribution"
      icon={<GroupIcon size={20} />}
      variant="compound"
      color="success"
    >
      {!isLoading && data && data.length > 0 && (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis dataKey="hourOfDay" tickFormatter={(h) => `${h}:00`} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="internalUnansweredCalls"
              stackId="a"
              fill="#10b981"
              name="Internal Unanswered"
            />
            <Bar
              dataKey="externalUnansweredCalls"
              stackId="a"
              fill="#f59e42"
              name="External Unanswered"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default InboundUnansweredHourly;
