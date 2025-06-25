import CallDistribution from "@/components/Stats/CallDistribution";
import TotalAnsweredCalls from "@/components/Stats/TotalAnsweredCalls";

const CallDistributionStats = () => {
  return (
    <div className="call-distribution gap-y-4 grid grid-cols-1 xl:gap-4 xl:grid-cols-3 py-4">
      <div className="col-span-2 max-h-[320px]">
        <CallDistribution />
      </div>
      <div className="col-span-1 max-h-[320px]">
        <TotalAnsweredCalls />
      </div>
    </div>
  );
};

export default CallDistributionStats;
