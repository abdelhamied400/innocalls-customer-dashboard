import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import statsService from "@/services/stats.service";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "next-intl";
import {
  AddIcCall,
  Call,
  HourglassBottom,
  LockClock,
  MoreVert,
  Phone,
  Refresh,
  RingVolume,
  Timer,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { refetchIntervals } from "@/constants/stats";

const AgentStats = () => {
  const t = useTranslations("dashboard.stats.todayCallsDuration");
  const tStatsCard = useTranslations("components.statsCard");

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "today_calls_duration_refetch_interval"
  );
  const { data, isRefetching, isLoading, isError, error, refetch } =
    useLocalizedQuery({
      queryKey: ["agent-stats"],
      queryFn: () => statsService.getAgentStats(),
      refetchInterval,
    });

  return (
    <div className="stats flex flex-col gap-2">
      <div className="bg-white shadow px-4 py-2 rounded-lg flex justify-between items-center gap-2">
        <h2 className="text-lg font-medium">{t("title")}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="unstyled" size="icon">
              <MoreVert />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {tStatsCard("refreshIntervals")}
            </DropdownMenuLabel>
            {refetchIntervals.map((interval) => (
              <DropdownMenuItem
                key={interval.label}
                onClick={() => {
                  setRefetchInterval?.(interval.value ?? 0);
                }}
              >
                {interval.translationKey
                  ? tStatsCard(interval.translationKey)
                  : interval.label}

                {refetchInterval === interval.value && (
                  <span className="ml-auto text-blue-500">✓</span>
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => refetch()}>
              <Refresh />
              {tStatsCard("refreshNow")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatsCard
          icon={<AddIcCall className="w-6 h-6" />}
          title={t("totalAnsweredCalls")}
          value={data?.totalAnsweredCalls || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="success"
        />
        <StatsCard
          icon={<AddIcCall className="w-6 h-6" />}
          title={t("totalCalls")}
          value={data?.totalCalls || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="primary"
        />
        <StatsCard
          icon={<RingVolume className="w-6 h-6" />}
          title={t("totalIncomingCalls")}
          value={data?.totalIncomingCalls || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="warning"
        />

        <StatsCard
          icon={<AddIcCall className="w-6 h-6" />}
          title={t("totalOutgoingCalls")}
          value={data?.totalOutgoingCalls || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="info"
        />
        <StatsCard
          icon={<LockClock className="w-6 h-6" />}
          title={t("totalTalkTime")}
          value={data?.totalTalkTime || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="success"
        />
        <StatsCard
          icon={<HourglassBottom className="w-6 h-6" />}
          title={t("totalWaitTime")}
          value={data?.totalWaitTime || "0"}
          isRefetching={isRefetching}
          isLoading={isLoading}
          isError={isError}
          error={error}
          color="warning"
        />
      </div>
    </div>
  );
};

export default AgentStats;
