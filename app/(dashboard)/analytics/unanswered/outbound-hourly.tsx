import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
} from "@/components/ChartCardNew";
import { GroupOutlined } from "@mui/icons-material";
import NoData from "@/components/Analytics/NoData";
import { UnansweredAnalyticsFilters } from "./page";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { formatDate } from "@/lib/date";
import ChartCustomTooltip from "@/components/ChartCustomTooltip";

type OutboundUnansweredHourlyProps = {
  filters: UnansweredAnalyticsFilters;
};

const OutboundUnansweredHourly = ({
  filters,
}: OutboundUnansweredHourlyProps) => {
  const t = useTranslations("analytics.unanswered");
  const tCommon = useTranslations("analytics.common");

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
      legends={[
        ...(filters.includeInternalCalls
          ? [
              {
                label: t("common.hourDistribution.internalUnanswered"),
                color: "#02D995",
              },
            ]
          : []),
        {
          label: t("common.hourDistribution.externalUnanswered"),
          color: "#F4592F",
        },
      ]}
    >
      {!isLoading && data && data.length > 0 && (
        <ResponsiveContainer
          style={{ direction: "ltr" }}
          width="100%"
          height={320}
        >
          <LineChart data={data}>
            <XAxis dataKey="hourOfDay" tickFormatter={(h) => `${h}:00`} />
            <YAxis />
            <Tooltip
              contentStyle={{ direction: locale.dir }}
              labelFormatter={(label) => `${label}:00`}
              includeHidden
              content={(props) => (
                <ChartCustomTooltip
                  {...props}
                  headerDataKeys={["unansweredCalls"]}
                />
              )}
            />

            {filters.includeInternalCalls && (
              <Line
                type="linear"
                dataKey="internalUnansweredCalls"
                stroke="#02D995"
                strokeWidth={2}
                name={t("common.hourDistribution.internalUnanswered")}
                dot={false}
              />
            )}

            <Line
              type="linear"
              dataKey="externalUnansweredCalls"
              stroke="#F4592F"
              strokeWidth={2}
              name={t("common.hourDistribution.externalUnanswered")}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundUnansweredHourly;
