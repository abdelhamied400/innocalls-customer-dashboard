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
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useState } from "react";
import { useTranslations } from "next-intl";

export type PerformanceStatsFiltersType = {
  filterType: "day" | "hour";
  sla: number;
};

type Option<T> = {
  value: T;
  label: string;
};

const PerformanceStatsFilters = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: PerformanceStatsFiltersType) => void;
}) => {
  const t = useTranslations("liveMonitor.performanceStats");

  const filterTypesOptions: Option<"day" | "hour">[] = [
    { value: "day", label: t("form.filter.type.options.day") },
    { value: "hour", label: t("form.filter.type.options.hour") },
  ];

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
            placeholder={t("form.fields.timePeriod.placeholder")}
          />
        </div>
        <div className="min-w-[200px]">
          <Field label={t("form.fields.sla.label")}>
            <Input
              type="number"
              value={sla}
              onChange={(e) => setSla(parseInt(e.target.value, 10))}
              placeholder={t("form.fields.sla.placeholder")}
              variant="field"
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onFiltersChange({ filterType: filterType.value, sla })}
        >
          {t("form.actions.apply")}
        </Button>
      </div>
    </div>
  );
};

const PerformanceStats = () => {
  const t = useTranslations("liveMonitor.performanceStats");

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
  } = useLocalizedQuery({
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
        title={t("title")}
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
            {t("errorLoading")}:{" "}
            {error instanceof Error ? error.message : t("unknownError")}
          </div>
        )}

        {!isLoading && !!performanceStats && (
          <div className="performance-stats grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
            <StatsCard
              title={t("statsCards.answerRate.title")}
              value={`${performanceStats?.current?.answerRate}%`}
              icon={<TrendingUp />}
              color="primary"
              info={`${performanceStats.change.answerRate} ${t(
                "statsCards.answerRate.comparison"
              )}`}
            />
            <StatsCard
              title={t("statsCards.totalWaitTime.title")}
              value={`${performanceStats.current.totalWaitTime} ${t(
                "statsCards.totalWaitTime.unit"
              )}`}
              icon={<HourglassBottom />}
              color="warning"
              info={`${performanceStats.change.totalWaitTime} ${t(
                "statsCards.totalWaitTime.comparison"
              )}`}
            />
            <StatsCard
              title={t("statsCards.totalTalkTime.title")}
              value={`${performanceStats.current.totalTalkTime} ${t(
                "statsCards.totalTalkTime.unit"
              )}`}
              icon={<AvTimer />}
              color="info"
              info={`${performanceStats.change.totalTalkTime} ${t(
                "statsCards.totalTalkTime.comparison"
              )}`}
            />
            <StatsCard
              title={t("statsCards.slaCompliance.title")}
              value={`${performanceStats.current.slaPercent}%`}
              icon={<GppGood />}
              color="default"
              info={`${performanceStats.change.slaPercent} ${t(
                "statsCards.slaCompliance.comparison"
              )}`}
            />
          </div>
        )}
      </StatsDetailedCard>
    </div>
  );
};

export default PerformanceStats;
