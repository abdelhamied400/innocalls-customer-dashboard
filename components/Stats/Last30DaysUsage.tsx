import { useLocalizedQuery } from "@/hooks/use-localized-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";
import { ViewCarousel } from "@mui/icons-material";

const Last30DaysUsage = () => {
  const t = useTranslations("dashboard.stats.last30DaysUsage");

  const {
    data: usage,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useLocalizedQuery({
    queryKey: ["last-30-days-usage"],
    queryFn: statsService.getLast30DaysUsage,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={<ViewCarousel />}
      title={t("title")}
      value={`${usage?.amount} ${usage?.currency}`}
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
      color="primary"
    ></StatsCard>
  );
};

export default Last30DaysUsage;
