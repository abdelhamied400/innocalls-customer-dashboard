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
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCard";
import { GroupOutlined } from "@mui/icons-material";
import NoData from "@/components/Analytics/NoData";
import { UnansweredAnalyticsFilters } from "./page";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";

type OutboundUnansweredHourlyProps = {
  filters: UnansweredAnalyticsFilters;
};

const OutboundUnansweredHourly = ({
  filters,
}: OutboundUnansweredHourlyProps) => {
  const t = useTranslations("analytics.unanswered");

  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const { data, isLoading, isError, error } = useLocalizedQuery({
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
      title={t("charts.outboundHourlyUnanswered")}
      icon={<GroupOutlined />}
      variant="compound"
      color="success"
    >
      {!isLoading && data && data.length > 0 && (
        <ResponsiveContainer
          style={{ direction: "ltr" }}
          width="100%"
          height={320}
        >
          <BarChart data={data}>
            <XAxis dataKey="hourOfDay" tickFormatter={(h) => `${h}:00`} />
            <YAxis />
            <Tooltip contentStyle={{ direction: locale.dir }} />

            {filters.includeInternalCalls && (
              <Bar
                dataKey="internalUnansweredCalls"
                stackId="a"
                fill={"#3b82f6"}
                name={t("common.hourDistribution.internalUnanswered")}
              />
            )}

            <Bar
              dataKey="externalUnansweredCalls"
              stackId="a"
              fill={"#9CA3AF"}
              name={t("common.hourDistribution.externalUnanswered")}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundUnansweredHourly;
