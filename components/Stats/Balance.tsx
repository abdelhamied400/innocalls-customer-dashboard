import { useQuery } from "@tanstack/react-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";

const Balance = () => {
  const {
    data: balance,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["balance"],
    queryFn: statsService.getBalance,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
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
      title="Balance"
      value={`${balance?.balance} ${balance?.currency}`}
      isRefetching={isRefetching}
      className="bg-amber-100"
    ></StatsCard>
  );
};

export default Balance;
