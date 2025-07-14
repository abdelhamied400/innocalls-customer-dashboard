import TotalCallsStats from "@/components/Stats/TotalCallsStats";
import TalkTimeStats from "@/components/Stats/TalkTimeStats";
import WaitTimeStats from "@/components/Stats/WaitTimeStats";

const HistoricalStats = () => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <TotalCallsStats />
        <TalkTimeStats />
        <WaitTimeStats />
      </div>
    </div>
  );
};

export default HistoricalStats;
