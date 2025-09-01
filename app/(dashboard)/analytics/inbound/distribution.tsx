import ChartCard from "@/components/ChartCard";
import { TimerOutlined } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { InboundAnalyticsFilters } from "./page";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import NoData from "@/components/Analytics/NoData";
import { useTranslations } from "@/providers/TranslationProvider";

type InboundAnalyticsDistributionProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsDistribution = ({
  filters,
}: InboundAnalyticsDistributionProps) => {
  const t = useTranslations("analytics.inbound.distribution");

  const {
    data: waitTimeData,
    isLoading: isWaitTimeLoading,
    error: waitTimeError,
    isError: isWaitTimeError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-wait-time-distribution", filters],
    queryFn: () => inboundAnalyticsService.fetchWaitTimeDistribution(filters),
  });

  const {
    data: talkTimeData,
    isLoading: isTalkTimeLoading,
    error: talkTimeError,
    isError: isTalkTimeError,
  } = useLocalizedQuery({
    queryKey: ["inbound-analytics-talk-time-distribution", filters],
    queryFn: () => inboundAnalyticsService.fetchTalkTimeDistribution(filters),
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard
        icon={<TimerOutlined />}
        title={t("waitTime.title")}
        color="primary"
        legends={[
          { label: t("waitTime.legends.totalCalls"), color: "#3B82F6" },
        ]}
        variant="compound"
        isLoading={isWaitTimeLoading}
        error={waitTimeError}
        isError={isWaitTimeError}
      >
        {waitTimeData?.length === 0 && <NoData />}
        {(waitTimeData?.length ?? 0) > 0 && (
          <ResponsiveContainer width="100%" height={288}>
            <BarChart data={waitTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="timeBucket"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  t(`waitTime.legends.timeBucket.${value}`)
                }
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                labelFormatter={(value) =>
                  t(`waitTime.legends.timeBucket.${value}`)
                }
              />
              <Bar
                name={t("waitTime.legends.totalCalls")}
                dataKey="totalCalls"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        icon={<TimerOutlined />}
        title={t("talkTime.title")}
        color="success"
        legends={[
          { label: t("talkTime.legends.totalCalls"), color: "#10B981" },
        ]}
        variant="compound"
        isLoading={isTalkTimeLoading}
        error={talkTimeError}
        isError={isTalkTimeError}
      >
        {talkTimeData?.length === 0 && <NoData />}
        {(talkTimeData?.length ?? 0) > 0 && (
          <ResponsiveContainer width="100%" height={288}>
            <BarChart data={talkTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="timeBucket"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  t(`talkTime.legends.timeBucket.${value}`)
                }
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                labelFormatter={(value) =>
                  t(`talkTime.legends.timeBucket.${value}`)
                }
              />
              <Bar
                name={t("talkTime.legends.totalCalls")}
                dataKey="totalCalls"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
};

export default InboundAnalyticsDistribution;
