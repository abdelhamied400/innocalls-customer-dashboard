import ChartCard from "@/components/ChartCard";
import { InboundAnalyticsFilters } from "./page";
import {
  Alarm,
  BarChart,
  Call,
  CompareArrows,
  ExitToApp,
  Group,
  Queue,
  Timer,
  Warning,
} from "@mui/icons-material";
import {
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import StatsCard from "@/components/StatsCard";
import StatsRowCard from "@/components/StatsRowCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { useQuery } from "@tanstack/react-query";
import inboundAnalyticsService from "@/services/inbound-analytics.service";
import Spinner from "@/components/ui/spinner";
import NoData from "@/components/Analytics/NoData";

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

type InboundAnalyticsQueueAnalysisProps = {
  filters: InboundAnalyticsFilters;
};
const InboundAnalyticsQueueAnalysis = ({
  filters,
}: InboundAnalyticsQueueAnalysisProps) => {
  const {
    data: abandonedAnalysis,
    isLoading: isLoadingAbandonedAnalysis,
    error: abandonedError,
  } = useQuery({
    queryKey: ["inbound-analytics-queue-abandoned-analysis", filters],
    queryFn: () => inboundAnalyticsService.fetchQueueAbandonedAnalysis(filters),
  });

  const {
    data: timeoutAnalysis,
    isLoading: isLoadingTimeoutAnalysis,
    error: timeoutError,
  } = useQuery({
    queryKey: ["inbound-analytics-queue-timeout-analysis", filters],
    queryFn: () => inboundAnalyticsService.fetchQueueTimeoutAnalysis(filters),
  });

  if (isLoadingAbandonedAnalysis || isLoadingTimeoutAnalysis) {
    return <Spinner />;
  }

  if (abandonedError || timeoutError) {
    return (
      <div className="flex flex-col gap-4">
        <p>{abandonedError?.message || timeoutError?.message}</p>
      </div>
    );
  }

  if (!abandonedAnalysis || !timeoutAnalysis) {
    return (
      <div className="flex flex-col gap-4">
        <NoData />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="header flex items-center gap-2">
        <h4>Abandoned Call Analysis</h4>
        <hr className="flex-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <StatsCard
          title="Total Abandoned Calls"
          value={abandonedAnalysis.total}
          icon={<Call />}
          color="destructive"
        />
        <StatsCard
          title="Unique Callers"
          value={abandonedAnalysis.uniqueCallers}
          icon={<Group />}
          color="warning"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ChartCard
          title="Queue Unanswered Calls Analysis"
          icon={<Alarm />}
          color="destructive"
          legends={abandonedAnalysis.stats.map((stat, index) => ({
            label: stat.timeBucket,
            color: colors[index % colors.length],
          }))}
          variant="compound"
        >
          <ResponsiveContainer width="100%" height={288}>
            <PieChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <Pie
                data={abandonedAnalysis.stats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ timeBucket }) => timeBucket}
              >
                {abandonedAnalysis.stats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Queue Statistics"
          icon={<BarChart />}
          color="destructive"
          variant="compound"
        >
          <div className="flex flex-col gap-2">
            <StatsRowCard
              label="Avg Wait Time"
              value={abandonedAnalysis.avgWaitTime}
              color="primary"
            />
            <StatsRowCard
              label="Min Wait Time"
              value={abandonedAnalysis.minWaitTime}
              color="warning"
            />
            <StatsRowCard
              label="Max Wait Time"
              value={abandonedAnalysis.maxWaitTime}
              color="success"
            />
            <StatsRowCard
              label="Peak Timeout Hour"
              value={abandonedAnalysis.peakHour}
              color="info"
            />
          </div>
        </ChartCard>
      </div>

      <div className="header flex items-center gap-2">
        <h4>Wait time distribution</h4>
        <hr className="flex-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <StatsCard
          title="Total Timeout Calls"
          value={timeoutAnalysis.total}
          icon={<Call />}
          color="destructive"
        />
        <StatsCard
          title="Unique Callers"
          value={timeoutAnalysis.uniqueCallers}
          icon={<Group />}
          color="warning"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ChartCard
          title="Queue Exit Timeout Analysis"
          icon={<ExitToApp />}
          color="warning"
          legends={timeoutAnalysis.stats.map((stat, index) => ({
            label: stat.timeBucket,
            color: colors[index % colors.length],
          }))}
          variant="compound"
        >
          <ResponsiveContainer width="100%" height={288}>
            <PieChart>
              <Pie
                data={timeoutAnalysis.stats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {timeoutAnalysis.stats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Queue Statistics"
          icon={<Queue />}
          color="warning"
          variant="compound"
        >
          <div className="flex flex-col gap-2">
            <StatsRowCard
              label="Avg Wait Time"
              value={timeoutAnalysis.avgWaitTime}
              color="primary"
            />
            <StatsRowCard
              label="Min Wait Time"
              value={timeoutAnalysis.minWaitTime}
              color="warning"
            />
            <StatsRowCard
              label="Max Wait Time"
              value={timeoutAnalysis.maxWaitTime}
              color="success"
            />
            <StatsRowCard
              label="Peak Timeout Hour"
              value={timeoutAnalysis.peakHour}
              color="info"
            />
          </div>
        </ChartCard>
      </div>
      <div className="header flex items-center gap-2">
        <h4>Inbound unanswered comparison</h4>
        <hr className="flex-1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ChartCard
          title="Abandoned vs Timeout Calls"
          icon={<CompareArrows />}
          color="info"
          variant="compound"
        >
          <StatsRowCard
            label="Total Abandoned Calls"
            value={abandonedAnalysis.total}
            color="destructive"
          />
          <StatsRowCard
            label="Total Timeout Calls"
            value={timeoutAnalysis.total}
            color="warning"
          />
          <StatsRowCard
            label="Total inbound unanswered"
            value={abandonedAnalysis.total + timeoutAnalysis.total}
            color="info"
          />
        </ChartCard>
        <ChartCard
          title="Wait Time Comparison"
          icon={<Timer />}
          color="info"
          variant="compound"
        >
          <StatsRowCard
            label="Total Abandon wait"
            value={abandonedAnalysis.avgWaitTime}
            color="destructive"
          />
          <StatsRowCard
            label="Total Timeout wait"
            value={timeoutAnalysis.avgWaitTime}
            color="warning"
          />
          <StatsRowCard
            label="Peak hours"
            value={timeoutAnalysis.peakHour}
            color="info"
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default InboundAnalyticsQueueAnalysis;
