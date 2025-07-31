import ChartCard from "@/components/ChartCard";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import { Call } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { InboundAnalyticsFilters } from "./page";
import NoData from "@/components/Analytics/NoData";
import { useTranslations } from "next-intl";

type InboundAnalyticsIVRAnalysisProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsIVRAnalysis = ({
  filters,
}: InboundAnalyticsIVRAnalysisProps) => {
  const t = useTranslations("analytics.inbound.ivrAnalysis");

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E42",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
  ];

  const {
    data: ivrAnalysisData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["inbound-analytics-ivr-analysis", filters],
    queryFn: () => inboundAnalyticsService.fetchIVRAnalysis(filters),
  });

  const chartData = ivrAnalysisData?.map((ivr: any) => {
    const optionData: any = { ivrName: ivr.name };
    ivr.options.forEach((option: any) => {
      optionData[`option${option.option}`] = option.count;
    });
    return optionData;
  });

  // Get all unique options from the IVR data for legends
  const getAllOptions = () => {
    if (!ivrAnalysisData || ivrAnalysisData.length === 0) return [];

    const allOptions = new Set<string>();
    ivrAnalysisData.forEach((ivr) => {
      ivr.options.forEach((option) => {
        allOptions.add(option.option);
      });
    });

    return Array.from(allOptions).sort();
  };

  const allOptions = getAllOptions();

  return (
    <div className="flex flex-col gap-4">
      <ChartCard
        title={t("title")}
        icon={<Call />}
        color="primary"
        legends={allOptions.map((option, index) => ({
          label: `${t("optionLabel")} ${option}`,
          color: colors[index % colors.length],
        }))}
        variant="compound"
        isLoading={isLoading}
        error={error}
        isError={isError}
      >
        <div className="w-full h-80">
          {ivrAnalysisData?.length === 0 && <NoData />}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="ivrName"
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
              <Tooltip />

              {allOptions.map((option, index) => (
                <Bar
                  key={option}
                  dataKey={`option${option}`}
                  fill={colors[index % colors.length]}
                  radius={[4, 4, 0, 0]}
                  name={`${t("optionLabel")} ${option}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};

export default InboundAnalyticsIVRAnalysis;
