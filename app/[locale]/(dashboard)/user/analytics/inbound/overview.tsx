import ChartCard from "@/components/ChartCard";
import AllInboundAnalytics from "@/services/inbound-analytics.service";
import { LineAxis } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InboundAnalyticsFilters } from "./page";
import NoData from "@/components/Analytics/NoData";

type InboundAnalyticsOverviewProps = { filters: InboundAnalyticsFilters };
const InboundAnalyticsOverview = ({
  filters,
}: InboundAnalyticsOverviewProps) => {
  const legends = {
    team: [
      { label: "Total Calls", color: "#3B82F6" },
      { label: "Completed Calls", color: "#10B981" },
      { label: "Timeout Calls", color: "#F59E42" },
      { label: "Abandoned Calls", color: "#EF4444" },
    ],
    all: [
      { label: "Total Calls", color: "#3B82F6" },
      { label: "Answered Calls", color: "#10B981" },
      { label: "External Calls", color: "#F59E42" },
      { label: "Internal Calls", color: "#A855F7" },
      { label: "Unanswered Calls", color: "#EF4444" },
    ],
  };

  const {
    data: overviewData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["inbound-analytics-overview", filters],
    queryFn: () => AllInboundAnalytics.fetchOverview(filters),
  });

  return (
    <ChartCard
      icon={<LineAxis />}
      title="Inbound Call Overview"
      color="primary"
      legends={legends[filters.filterBy]}
      variant="compound"
      isLoading={isLoading}
      isError={isError}
      error={error}
    >
      {overviewData?.length === 0 && <NoData />}
      {(overviewData?.length ?? 0) > 0 && (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="hourOfDay"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{
                  value: "Hour",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(_, name) => {
                  // Map dataKey to label
                  const keyToLabel: Record<string, string> = {
                    totalCalls: "Total Calls",
                    answeredCalls: "Answered Calls",
                    externalCalls: "External Calls",
                    internalCalls: "Internal Calls",
                    unansweredCalls: "Unanswered Calls",
                    abandonedCalls: "Abandoned Calls",
                    completedCalls: "Completed Calls",
                    timeoutCalls: "Timeout Calls",
                  };
                  return [_, keyToLabel[name as string] || name];
                }}
              />
              <Line
                type="monotone"
                dataKey="totalCalls"
                label="Total Calls"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="answeredCalls"
                label="Answered Calls"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="externalCalls"
                label="External Calls"
                stroke="#F59E42"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="internalCalls"
                label="Internal Calls"
                stroke="#A855F7"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="unansweredCalls"
                label="Unanswered Calls"
                stroke="#EF4444"
                strokeWidth={3}
                dot={false}
              />
              {/* team */}
              <Line
                type="monotone"
                dataKey="abandonedCalls"
                label="Abandoned Calls"
                stroke="#F54002"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="completedCalls"
                label="Completed Calls"
                stroke="#10B981"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="timeoutCalls"
                label="Timeout Calls"
                stroke="#F59E42"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
};

export default InboundAnalyticsOverview;
