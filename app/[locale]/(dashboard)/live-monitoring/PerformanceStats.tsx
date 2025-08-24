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
import { formatNumbers } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

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
  filters,
}: {
  onFiltersChange: (filters: PerformanceStatsFiltersType) => void;
  filters: PerformanceStatsFiltersType;
}) => {
  const t = useTranslations("liveMonitor.performanceStats");
  const queryClient = useQueryClient();

  const filterTypesOptions: Option<"day" | "hour">[] = [
    { value: "day", label: t("form.filter.type.options.day") },
    { value: "hour", label: t("form.filter.type.options.hour") },
  ];

  const [filterType, setFilterType] = useState<Option<"day" | "hour">>(
    filterTypesOptions[0]
  );
  const [sla, setSla] = useState<number>(30);
  const [slaError, setSlaError] = useState<string>("");

  const validateSla = (value: number): boolean => {
    if (isNaN(value) || !Number.isInteger(value) || value < 1) {
      setSlaError(t("form.fields.sla.validation.invalid"));
      return false;
    }
    setSlaError("");
    return true;
  };

  const handleSlaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSla(value);

    // Clear error when user starts typing
    if (slaError) {
      setSlaError("");
    }
  };

  const handleApplyFilters = () => {
    if (validateSla(sla)) {
      onFiltersChange({ filterType: filterType.value, sla });
      // Invalidate the query to refetch data with new filters
      queryClient.invalidateQueries({
        queryKey: ["performanceStats", { filterType: filterType.value, sla }],
      });
    }
  };

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
          <Field label={t("form.fields.sla.label")} error={slaError}>
            <Input
              type="number"
              value={sla}
              onChange={handleSlaChange}
              placeholder={t("form.fields.sla.placeholder")}
              variant="field"
              min="1"
              step="1"
              className={slaError ? "border-red-500 focus:border-red-500" : ""}
            />
          </Field>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleApplyFilters}>{t("form.actions.apply")}</Button>
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
        <PerformanceStatsFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
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
          <div className="performance-stats grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatsCard
              title={t("statsCards.answerRate.title")}
              value={`${performanceStats.answerRate?.current}\u200E%`}
              icon={<TrendingUp />}
              color="primary"
              info={t("statsCards.answerRate.comparison", {
                percentage: `${formatNumbers(
                  performanceStats.answerRate?.change || 0
                )}\u200E`,
              })}
            />
            <StatsCard
              title={t("statsCards.totalWaitTime.title")}
              value={`${performanceStats.totalWaitTime?.current} ${t(
                "statsCards.totalWaitTime.unit"
              )}`}
              icon={<HourglassBottom />}
              color="warning"
              info={t("statsCards.totalWaitTime.comparison", {
                percentage: `${formatNumbers(
                  performanceStats.totalWaitTime?.change || 0
                )}\u200E`,
              })}
            />
            <StatsCard
              title={t("statsCards.totalTalkTime.title")}
              value={`${performanceStats.totalTalkTime?.current} ${t(
                "statsCards.totalTalkTime.unit"
              )}`}
              icon={<AvTimer />}
              color="info"
              info={t("statsCards.totalTalkTime.comparison", {
                percentage: `${formatNumbers(
                  performanceStats.totalTalkTime?.change || 0
                )}\u200E`,
              })}
            />
            <StatsCard
              title={t("statsCards.slaCompliance.title")}
              value={`${performanceStats.slaPercent?.current}\u200E%`}
              icon={<GppGood />}
              color="default"
              info={t("statsCards.slaCompliance.comparison", {
                percentage: `${formatNumbers(
                  performanceStats.slaPercent?.change || 0
                )}\u200E`,
              })}
            />
          </div>
        )}
      </StatsDetailedCard>
    </div>
  );
};

export default PerformanceStats;
