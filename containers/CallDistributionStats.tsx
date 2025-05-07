import CallDistribution from "@/components/Stats/CallDistribution";
import TotalCalls from "@/components/Stats/TotalCalls";

const CallDistributionStats = () => {
  return (
    <div className="call-distribution">
      <h3>Call Distribution</h3>
      <div className="gap-y-4 grid grid-cols-1 xl:gap-4 xl:grid-cols-3 py-4">
        <div className="col-span-2 max-h-[320px]">
          <CallDistribution />
        </div>
        <div className="col-span-1 max-h-[320px]">
          <TotalCalls />
        </div>
      </div>
    </div>
  );
};

export default CallDistributionStats;
