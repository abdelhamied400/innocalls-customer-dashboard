import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCardNew";
import NoData from "@/components/Analytics/NoData";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import { UnansweredAnalyticsFilters } from "./page";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import RechartTooltip from "@/components/RechartTooltip";
import { defaultLocale, locales } from "@/i18n/config";
import { formatDate } from "@/lib/date";
import ChartCustomTooltip from "@/components/ChartCustomTooltip";

type OutboundDistributionProps = {
  filters: UnansweredAnalyticsFilters;
};

const OutboundDistribution = ({ filters }: OutboundDistributionProps) => {
  const t = useTranslations("analytics.unanswered");
  const tCommon = useTranslations("analytics.common");

  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["outboundDistribution", filters],
    queryFn: () =>
      unansweredAnalyticsService.fetchOutboundDistribution(filters),
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
        {
          label: t("outbound.callDistribution.lineLabels.totalCalls"),
          color: "#3B82F6",
        },
        {
          label: t("outbound.callDistribution.lineLabels.unansweredTotal"),
          color: "#9CA3AF",
        },
        ...(filters.includeInternalCalls
          ? [
              {
                label: t(
                  "outbound.callDistribution.lineLabels.outboundInternal"
                ),
                color: "#10B981",
              },
            ]
          : []),
        {
          label: t("outbound.callDistribution.lineLabels.outboundExternal"),
          color: "#6366F1",
        },
        ...(filters.includeInternalCalls
          ? [
              {
                label: t(
                  "outbound.callDistribution.lineLabels.unansweredInternal"
                ),
                color: "#F59E0B",
              },
            ]
          : []),
        {
          label: t("outbound.callDistribution.lineLabels.unansweredExternal"),
          color: "#EF4444",
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{ direction: locale.dir }}
              content={(props) => (
                <ChartCustomTooltip
                  {...props}
                  headerDataKeys={["totalCalls", "unansweredCalls"]}
                />
              )}
            />

            <Line
              type="monotone"
              dataKey="totalCalls"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.totalCalls")}
            />
            <Line
              type="monotone"
              dataKey="unansweredCalls"
              stroke="#9CA3AF"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.unansweredTotal")}
            />

            {filters.includeInternalCalls && (
              <Line
                type="monotone"
                dataKey="internalCalls"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name={t(
                  "outbound.callDistribution.lineLabels.outboundInternal"
                )}
              />
            )}

            <Line
              type="monotone"
              dataKey="externalCalls"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
              name={t("outbound.callDistribution.lineLabels.outboundExternal")}
            />

            {filters.includeInternalCalls && (
              <Line
                type="monotone"
                dataKey="internalUnansweredCalls"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                name={t(
                  "outbound.callDistribution.lineLabels.unansweredInternal"
                )}
              />
            )}

            <Line
              type="monotone"
              dataKey="externalUnansweredCalls"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name={t(
                "outbound.callDistribution.lineLabels.unansweredExternal"
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default OutboundDistribution;
