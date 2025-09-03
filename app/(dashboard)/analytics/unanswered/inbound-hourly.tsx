import { useLocalizedQuery } from "@/hooks/use-localized-query";
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
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import { GroupIcon } from "lucide-react";
import NoData from "@/components/Analytics/NoData";
import { UnansweredAnalyticsFilters } from "./page";
import { useTranslations } from "@/providers/TranslationProvider";

type InboundUnansweredHourlyProps = {
  filters: UnansweredAnalyticsFilters;
};
const InboundUnansweredHourly = ({ filters }: InboundUnansweredHourlyProps) => {
  const t = useTranslations("analytics.unanswered");

  const { data, isLoading, isError, error } = useLocalizedQuery({
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
      title={t("charts.inboundHourlyUnanswered")}
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

            {filters.includeInternalCalls && (
              <Bar
                dataKey="internalUnansweredCalls"
                stackId="a"
                fill="#10b981"
                name={t("common.hourDistribution.internalUnanswered")}
              />
            )}

            <Bar
              dataKey="externalUnansweredCalls"
              stackId="a"
              fill="#f59e42"
              name={t("common.hourDistribution.externalUnanswered")}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default InboundUnansweredHourly;
