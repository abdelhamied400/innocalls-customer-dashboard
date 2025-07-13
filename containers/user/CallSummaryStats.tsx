import AnswerRate from "@/components/Stats/AnswerRate";
import AverageDuration from "@/components/Stats/AverageDuration";
import TotalIncomingCalls from "@/components/Stats/TotalIncomingCalls";
import TotalOutgoingCalls from "@/components/Stats/TotalOutgoingCalls";

const CallSummaryStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <TotalIncomingCalls />
      <TotalOutgoingCalls />
      <AnswerRate />
      <AverageDuration />
    </div>
  );
};

export default CallSummaryStats;
