import StatsCard from "@/components/StatsCard";
import { BarChart, Bolt, ShowChart } from "@mui/icons-material";

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Peak Day */}
      <StatsCard
        title="Peak Day"
        value="Wednesday"
        icon={<ShowChart />}
        color="info"
      />

      {/* Avg Daily Calls */}
      <StatsCard
        title="Avg Daily Calls"
        value="1,247"
        icon={<BarChart />}
        color="success"
      />

      {/* Best Response */}
      <StatsCard
        title="Best Response"
        value="2.3s"
        icon={<Bolt />}
        color="warning"
      />
    </div>
  );
};

export default QuickStats;
