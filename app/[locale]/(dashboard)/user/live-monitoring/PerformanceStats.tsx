import NoData from "@/components/Analytics/NoData";
import Select from "@/components/select";
import StatsCard, { StatsCardSkeleton } from "@/components/StatsCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import {
  AvTimer,
  GppGood,
  HourglassBottom,
  TrendingUp,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export type PerformanceStatsFiltersType = {
  filterType: "day" | "hour";
  sla: number;
};

type Option<T> = {
  value: T;
  label: string;
};

const filterTypesOptions: Option<"day" | "hour">[] = [
  { value: "day", label: "Per day" },
  { value: "hour", label: "Per hour" },
];

const PerformanceStatsFilters = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: PerformanceStatsFiltersType) => void;
}) => {
  const [filterType, setFilterType] = useState<Option<"day" | "hour">>(
    filterTypesOptions[0]
  );
  const [sla, setSla] = useState<number>(10);

  return (
    <div className="filters flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[200px]">
          <Select
            value={filterType}
            onChange={(value) => setFilterType(value as Option<"day" | "hour">)}
            options={filterTypesOptions}
            placeholder="Time Period"
          />
        </div>
        <div className="min-w-[200px]">
          <Field label="sla">
            <Input
              type="number"
              value={sla}
              onChange={(e) => setSla(parseInt(e.target.value, 10))}
              placeholder="SLA (seconds)"
              variant="field"
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onFiltersChange({ filterType: filterType.value, sla })}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

const PerformanceStats = () => {
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_live_calls_interval"
  );
  const [filters, setFilters] = useState<PerformanceStatsFiltersType>({
    filterType: "day",
    sla: 10,
  });
  const {
    data: performanceStats,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["performanceStats", filters],
    queryFn: () => liveMonitoringService.fetchQueueStats(filters),
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <StatsDetailedCard
        title="Performance Stats Filters"
        icon={<AvTimer />}
        color="info"
        value=""
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        <PerformanceStatsFilters onFiltersChange={setFilters} />
        {isLoading && (
          <div className="performance-stats grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        )}
        {!isLoading && !performanceStats && <NoData />}

        {!isLoading && isError && (
          <div className="text-red-500">
            Error loading performance stats:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {!isLoading && !!performanceStats && (
          <div className="performance-stats grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
            <StatsCard
              title="Answer Rate"
              value={`${performanceStats.current.answerRate}%`}
              icon={<TrendingUp />}
              color="primary"
              info={`${performanceStats.change.answerRate}% vs previous`}
            />
            <StatsCard
              title="Total Wait Time"
              value={`${performanceStats.current.totalWaitTime} seconds`}
              icon={<HourglassBottom />}
              color="warning"
              info={`${performanceStats.change.totalWaitTime} % vs previous`}
            />
            <StatsCard
              title="Total Talk Time"
              value={`${performanceStats.current.totalTalkTime} seconds`}
              icon={<AvTimer />}
              color="info"
              info={`${performanceStats.change.totalTalkTime} % vs previous`}
            />
            <StatsCard
              title="SLA Compliance"
              value={`${performanceStats.current.slaPercent}%`}
              icon={<GppGood />}
              color="default"
              info={`${performanceStats.change.slaPercent}% vs previous`}
            />
          </div>
        )}
      </StatsDetailedCard>
    </div>
  );
};

export default PerformanceStats;
