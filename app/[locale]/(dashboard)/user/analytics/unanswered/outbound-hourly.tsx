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
import { useQuery } from "@tanstack/react-query";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import { GroupOutlined } from "@mui/icons-material";
import NoData from "@/components/Analytics/NoData";

type OutboundUnansweredHourlyProps = {
  filters: UnAnsweredAnalyticsFilters;
};

const OutboundUnansweredHourly = ({
  filters,
}: OutboundUnansweredHourlyProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["outboundUnansweredHourly", filters],
    queryFn: () =>
      unansweredAnalyticsService.fetchOutboundUnansweredHourly(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title="Outbound Hourly Unanswered Calls"
      icon={<GroupOutlined />}
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
              fill={"#3b82f6"}
              name="Internal Unanswered"
            />
            <Bar
              dataKey="externalUnansweredCalls"
              stackId="a"
              fill={"#9CA3AF"}
              name="External Unanswered"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundUnansweredHourly;
