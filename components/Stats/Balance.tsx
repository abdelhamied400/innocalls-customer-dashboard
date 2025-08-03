import { useLocalizedQuery } from "@/hooks/use-localized-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";
import { usePersistentRefetchInterval } from "@/hooks/use-persistent-refetch-interval";
import { AccountBalanceWallet } from "@mui/icons-material";

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
  } = useLocalizedQuery({
    queryKey: ["balance"],
    queryFn: statsService.getBalance,
    refetchOnWindowFocus: false,
    refetchInterval,
    refetchOnMount: "always",
    retry: false,
  });

  return (
    <StatsCard
      icon={<AccountBalanceWallet />}
      title={t("title")}
      value={`${balance?.balance} ${balance?.currency}`}
      color="warning"
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
      canRefetch
      refetchInterval={refetchInterval}
      setRefetchInterval={setRefetchInterval}
      refetch={refetch}
    ></StatsCard>
  );
};

export default Balance;
