import CallDistribution from "@/components/Stats/CallDistribution";
import TotalAnsweredCalls from "@/components/Stats/TotalAnsweredCalls";

const CallDistributionStats = () => {
  return (
    <div className="call-distribution-stats">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Call Distribution Chart */}
        <div className="xl:col-span-2 relative overflow-hidden">
          <div className="h-80">
            <CallDistribution />
          </div>
        </div>

        {/* Total Answered Calls Chart */}
        <div className="h-full relative overflow-hidden">
          <div className="h-full">
            <TotalAnsweredCalls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDistributionStats;
