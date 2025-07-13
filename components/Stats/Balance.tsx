import { useQuery } from "@tanstack/react-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";

const Balance = () => {
  const t = useTranslations("dashboard.stats.balance");
  const { refetchInterval, setRefetchInterval } = usePersistentRefetchInterval(
    "balance_refetch_interval"
  );

  const {
    data: balance,
    isRefetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: statsService.getBalance,
    refetchOnWindowFocus: false,
    refetchInterval,
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
      icon={<img src="/assets/icons/stats/wallet.svg" alt="" />}
      title={t("title")}
      value={`${balance?.balance} ${balance?.currency}`}
      color="warning"
      isRefetching={isRefetching}
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default Balance;
