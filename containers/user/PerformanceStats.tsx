import CallsTrend from "@/components/Stats/CallsTrend";
import PerformanceOverview from "@/components/Stats/PerformanceOverview";

const PerformanceStats = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
      {/* Calls Trend Chart */}
      <div className="relative overflow-hidden">
        <div className="h-64">
          <CallsTrend />
        </div>
      </div>

      {/* Performance Overview Chart */}
      <div className="relative overflow-hidden">
        <div className="h-64">
          <PerformanceOverview />
        </div>
      </div>
    </div>
  );
};

export default PerformanceStats;
