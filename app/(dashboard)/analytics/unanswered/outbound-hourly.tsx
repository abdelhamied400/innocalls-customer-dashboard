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
      title={tCommon("fromTo", {
        from: formatDate(filters.fromDate, {
          locale: localeSlug,
        }),
        to: formatDate(filters.toDate, {
          locale: localeSlug,
        }),
      })}
      legends={[
        ...(filters.includeInternalCalls
          ? [
              {
                label: t("common.hourDistribution.internalUnanswered"),
                color: "#3b82f6",
              },
            ]
          : []),
        {
          label: t("common.hourDistribution.externalUnanswered"),
          color: "#9CA3AF",
        },
      ]}
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
