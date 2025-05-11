import StatsCard, {
  StatsCardError,
  StatsCardSkeleton,
} from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

const TodayCallsDuration = () => {
  const {
    data: lastHourCallsDuration,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["today-calls-duration"],
    queryFn: statsService.getTodayCallsDuration,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
    refetchOnMount: "always",
    retry: false,
  });

  const formatDuration = (duration: string[]) => {
    return duration
      .map((time, index) => {
        if (index === 0) return `${time}H`;
        if (index === 1) return `${time}M`;
        if (index === 2) return `${time}S`;
        return "";
      })
      .join(" ");
  };

  if (isLoading || isRefetching) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={
        <img
          src="/assets/icons/stats/timer.svg"
          alt="Today Calls Duration Icon"
        />
      }
      title="Total call duration today"
      value={formatDuration(lastHourCallsDuration.allDay.totalAnsweredDuration)}
      className="shadow-none"
      info={
        <p className="text-sm text-gray-500">
          Based on{" "}
          <span className="font-bold">
            {lastHourCallsDuration.allDay.totalAnsweredCount}
          </span>{" "}
          calls of total{" "}
          <span className="font-bold">
            {lastHourCallsDuration.allDay.total}
          </span>{" "}
          calls
        </p>
      }
    ></StatsCard>
  );
};

export default TodayCallsDuration;
