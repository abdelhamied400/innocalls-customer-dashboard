import StatsCard from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import {
  Call,
  CallMade,
  CallReceived,
  South,
  TimerOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const CallSummaryStats = () => {
  const {
    data: summaryStats,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["callSummaryStats"],
    queryFn: statsService.fetchCallSummaryStats,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
      {/* Call Summary Stats */}
      <StatsCard
        title="Total Incoming"
        value={summaryStats?.inbound.current || "0"}
        info={`${Math.round(summaryStats?.inbound.change || 0)}% vs last month`}
        icon={<CallReceived />}
        color="primary"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title="Total Outgoing"
        value={summaryStats?.outbound.current || "0"}
        info={`${Math.round(
          summaryStats?.outbound.change || 0
        )}% vs last month`}
        icon={<CallMade />}
        color="success"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title="Answer Rate"
        value={`${Math.round(summaryStats?.answerRate.current || 0)}%`}
        info={`${Math.round(
          summaryStats?.answerRate.change || 0
        )}% vs last month`}
        icon={<Call />}
        color="info"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title="Talk Time"
        value={`${Math.round(summaryStats?.talkTime.current || 0)}s`}
        info={`${Math.round(
          summaryStats?.talkTime.change || 0
        )}% vs last month`}
        icon={<TimerOutlined />}
        color="warning"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title="Wait Time"
        value={`${Math.round(summaryStats?.waitTime.current || 0)}s`}
        info={`${Math.round(
          summaryStats?.waitTime.change || 0
        )}% vs last month`}
        icon={<TimerOutlined />}
        color="destructive"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <StatsCard
        title="Internal Calls"
        value={summaryStats?.internal.current || "0"}
        info={`${Math.round(
          summaryStats?.internal.change || 0
        )}% vs last month`}
        icon={<South />}
        color="default"
        isRefetching={isRefetching}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default CallSummaryStats;
