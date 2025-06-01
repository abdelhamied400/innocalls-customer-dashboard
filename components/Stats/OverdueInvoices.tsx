import { useQuery } from "@tanstack/react-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";

const OverdueInvoices = () => {
  const {
    data: overdueInvoices,
    isRefetching,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["overdue-invoices"],
    queryFn: statsService.getOverdueInvoices,
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
      icon={<img src="/assets/icons/stats/calendar.svg" alt="" />}
      title="Overdue Invoices"
      value={`${overdueInvoices?.totalAmount.toFixed(2)} ${
        overdueInvoices?.currency
      }`}
      isRefetching={isRefetching}
      className="bg-destructive-100"
    ></StatsCard>
  );
};

export default OverdueInvoices;
