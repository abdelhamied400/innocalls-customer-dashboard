import AnswerRate from "@/components/Stats/AnswerRate";
import AverageDuration from "@/components/Stats/AverageDuration";
import TotalIncomingCalls from "@/components/Stats/TotalIncomingCalls";
import TotalOutgoingCalls from "@/components/Stats/TotalOutgoingCalls";

const CallSummaryStats = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
      {/* Call Summary Stats */}
      <TotalIncomingCalls />
      <TotalOutgoingCalls />
      <AnswerRate />
      <AverageDuration />
    </div>
  );
};

export default CallSummaryStats;
