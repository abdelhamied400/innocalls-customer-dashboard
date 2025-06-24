import { useQuery } from "@tanstack/react-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";

const Last30DaysUsage = () => {
  const t = useTranslations("dashboard.stats.last30DaysUsage");

  const {
    data: usage,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["last-30-days-usage"],
    queryFn: statsService.getLast30DaysUsage,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    retry: false,
  });

  if (isLoading) {
    return <StatsCardSkeleton />;
  }

  if (isError) {
    return <StatsCardError error={error} />;
  }

  return (
    <StatsCard
      icon={<img src="/assets/icons/stats/carousel.svg" alt="" />}
      title={t("title")}
      value={`${usage?.amount} ${usage?.currency}`}
      isRefetching={isRefetching}
    ></StatsCard>
  );
};

export default Last30DaysUsage;
