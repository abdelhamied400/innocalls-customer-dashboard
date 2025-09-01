import NoData from "@/components/Analytics/NoData";
import QueueCard from "@/components/LiveMonitoring/QueueCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import liveMonitoringService from "@/services/live-monitoring.service";
import { Queue } from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useTranslations } from "@/providers/TranslationProvider";
import { useState, useEffect } from "react";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export type QueueManagementFilters = {
  sla: number;
};

const QueueManagement = () => {
  const t = useTranslations("liveMonitor.queueManagement");
  // zod schema for the filters
  const filtersSchema = z.object({
    sla: z
      .number()
      .min(1, t("form.fields.sla.invalid"))
      .int(t("form.fields.sla.invalid")),
  });

  const [filters, setFilters] = useState<QueueManagementFilters>({
    sla: 30,
  });

  const [shouldRefetch, setShouldRefetch] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<QueueManagementFilters>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      sla: 30,
    },
    mode: "onChange",
  });

  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "live_monitoring_queue_management_interval"
  );
  const {
    data: queueManagementData,
    isLoading,
    isRefetching,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["queueManagementData", filters],
    queryFn: () => liveMonitoringService.fetchQueueData(filters),
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
    staleTime: 1,
  });

  const onSubmit = (data: QueueManagementFilters) => {
    setFilters(data);
    setShouldRefetch(true);
  };

  // Effect to handle refetch after filters are updated
  useEffect(() => {
    if (shouldRefetch) {
      refetch();
      setShouldRefetch(false);
    }
  }, [filters, shouldRefetch, refetch]);

  return (
    <div className="queue-management">
      <StatsDetailedCard
        title={t("title")}
        subtitle={t("subtitle")}
        value={queueManagementData?.length || 0}
        valueSubtitle={t("valueSubtitle")}
        icon={<Queue />}
        color="info"
        refetch={refetch}
        canRefetch
        isRefetching={isRefetching}
        refetchInterval={refetchInterval}
        setRefetchInterval={setRefetchInterval}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="filters flex items-center gap-2">
            <div className="min-w-[200px]">
              <Field
                label={t("form.fields.sla.label")}
                error={errors.sla?.message}
              >
                <Input
                  {...register("sla", {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder={t("form.fields.sla.placeholder")}
                  variant="field"
                />
              </Field>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isValid}>
              {t('actions.applyFilters')}
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        )}

        {!isLoading && !queueManagementData?.length && <NoData />}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {queueManagementData?.map((queue) => (
            <QueueCard
              key={queue.queue}
              title={queue.queue}
              subtitle={`${t("queueCard.totalCalls")}: ${
                queue.stats.totalCalls
              }`}
              stats={queue.stats}
              activeCalls={queue.activeCalls.map((call) => ({
                ...call,
                phoneNumber: call.caller,
                callDuration: call.connectedAt
                  ? Math.floor(
                      (Date.now() -
                        new Date(call.connectedAt * 1000).getTime()) /
                        1000
                    )
                  : 0,
              }))}
              waitingCalls={queue.waitingCalls.map((call) => ({
                ...call,
                phoneNumber: call.caller,
                callDuration: call.enteredAt
                  ? Math.floor(
                      (Date.now() - new Date(call.enteredAt * 1000).getTime()) /
                        1000
                    )
                  : 0,
              }))}
              sla={`${queue.stats.slaCompliance}%`}
            />
          ))}
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default QueueManagement;
