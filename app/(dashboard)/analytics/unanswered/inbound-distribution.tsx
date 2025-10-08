import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import unansweredAnalyticsService from "@/services/unanswered-analytics.service";
import ChartCard, {
  ChartCardError,
  ChartCardSkeleton,
} from "@/components/ChartCardNew";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import NoData from "@/components/Analytics/NoData";
import { UnansweredAnalyticsFilters } from "./page";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import { defaultLocale, locales } from "@/i18n/config";
import { formatDate } from "@/lib/date";
import ChartCustomTooltip from "@/components/ChartCustomTooltip";

type InboundDistributionProps = {
  filters: UnansweredAnalyticsFilters;
};

const InboundDistribution = ({ filters }: InboundDistributionProps) => {
  const t = useTranslations("analytics.unanswered");
  const tCommon = useTranslations("analytics.common");
  const localeSlug = useLocale() || defaultLocale;
  const locale = locales[localeSlug];

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["inboundDistribution", filters],
    queryFn: () => unansweredAnalyticsService.fetchInboundDistribution(filters),
  });

  if (isLoading) {
    return <ChartCardSkeleton />;
  }

  if (isError) {
    return <ChartCardError error={error} />;
  }

  return (
    <ChartCard
      title={t("charts.inboundDistribution")}
      legends={[
        ...(filters.includeInternalCalls
          ? [
              {
                label: t("inbound.callDistribution.lineLabels.inboundInternal"),
                color: "#02D995",
              },
            ]
          : []),
        {
          label: t("inbound.callDistribution.lineLabels.inboundExternal"),
          color: "#F4592F",
        },
        ...(filters.includeInternalCalls
          ? [
              {
                label: t("inbound.callDistribution.lineLabels.missedInternal"),
                color: "#F6A731",
              },
            ]
          : []),
        {
          label: t("inbound.callDistribution.lineLabels.missedExternal"),
          color: "#2021AD",
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E7EF" />
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
              includeHidden
              content={(props) => (
                <ChartCustomTooltip
                  {...props}
                  headerDataKeys={["totalCalls", "unansweredCalls"]}
                />
              )}
            />

            <Line
              type="linear"
              dataKey="totalCalls"
              stroke="#1976D2"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.totalCalls")}
              hide
            />
            <Line
              type="linear"
              dataKey="unansweredCalls"
              stroke="#757575"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.missedTotal")}
              hide
            />

            {filters.includeInternalCalls && (
              <Line
                type="linear"
                dataKey="internalCalls"
                stroke="#02D995"
                strokeWidth={2}
                dot={false}
                name={t("inbound.callDistribution.lineLabels.inboundInternal")}
              />
            )}

            <Line
              type="linear"
              dataKey="externalCalls"
              stroke="#F4592F"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.inboundExternal")}
            />

            {filters.includeInternalCalls && (
              <Line
                type="linear"
                dataKey="internalUnansweredCalls"
                stroke="#F6A731"
                strokeWidth={2}
                dot={false}
                name={t("inbound.callDistribution.lineLabels.missedInternal")}
              />
            )}

            <Line
              type="linear"
              dataKey="externalUnansweredCalls"
              stroke="#2021AD"
              strokeWidth={2}
              dot={false}
              name={t("inbound.callDistribution.lineLabels.missedExternal")}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
      {!isLoading && (!data || data.length === 0) && <NoData />}
    </ChartCard>
  );
};

export default InboundDistribution;
