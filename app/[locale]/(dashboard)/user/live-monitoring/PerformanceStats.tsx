import StatsCard from "@/components/StatsCard";
import {
  AvTimer,
  GppGood,
  HourglassBottom,
  TrendingUp,
} from "@mui/icons-material";

const PerformanceStats = () => {
  return (
    <div className="performance-stats grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
      <StatsCard
        title="Answer Rate"
        value="79%"
        icon={<TrendingUp />}
        color="primary"
        info="+33.9% vs previous"
      />
      <StatsCard
        title="Avg Wait Time"
        value="76s"
        icon={<HourglassBottom />}
        color="warning"
        info="+7.0% vs previous"
      />
      <StatsCard
        title="Avg Talk Time"
        value="6:43"
        icon={<AvTimer />}
        color="info"
        info="+35.2% vs previous"
      />
      <StatsCard
        title="SLA Compliance"
        value="91%"
        icon={<GppGood />}
        color="default"
        info="+5.8% vs previous"
      />
    </div>
  );
};

export default PerformanceStats;
