import ErgLast30DaysCallsSummary from "@/components/Stats/ErgLast30DaysCallsSummary";
import ErgLast30DaysTalkTime from "@/components/Stats/ErgLast30DaysTalkTime";
import ErgLast30DaysWaitingTime from "@/components/Stats/ErgLast30DaysWaitingTime";
import CallsTrend from "@/components/Stats/CallsTrend";
import PerformanceOverview from "@/components/Stats/PerformanceOverview";
import { useTranslations } from "next-intl";

const ErgHistoricalStats = () => {
  const t = useTranslations("dashboard.containers");

  return <div className="erg-historical-stats"></div>;
};

export default ErgHistoricalStats;
