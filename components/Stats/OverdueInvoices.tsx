import { useQuery } from "@tanstack/react-query";
import StatsCard, { StatsCardError, StatsCardSkeleton } from "../StatsCard";
import statsService from "@/services/stats.service";
import { useTranslations } from "next-intl";
import { Event } from "@mui/icons-material";

const OverdueInvoices = () => {
  const t = useTranslations("dashboard.stats.overdueInvoices");

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

  return (
    <StatsCard
      icon={<Event />}
      title={t("title")}
      value={`${overdueInvoices?.totalAmount.toFixed(2)} ${
        overdueInvoices?.currency
      }`}
      isRefetching={isRefetching}
      isLoading={isLoading}
      isError={isError}
      error={error}
      color="destructive"
    ></StatsCard>
  );
};

export default OverdueInvoices;
