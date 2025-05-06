import StatsCard, { StatsCardError } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";

const ErgLast30DaysWaitingTime = async () => {
  try {
    const ergStats = await statsService.getErgLast30DaysWaitingTime();
    const {
      avgWaitTimeAbandonCalls,
      avgWaitTimeCompletedCalls,
      totalWaitTimeAbandonCalls,
      totalWaitTimeCompletedCalls,
    } = ergStats;

    return (
      <StatsCard
        icon={
          <img
            src="/assets/icons/stats/phone.svg"
            alt="Last 30 Days Waiting Time Icon"
          />
        }
        title="Last 30 Days Waiting Time"
        value={totalWaitTimeCompletedCalls}
        info={
          <div className="flex flex-wrap gap-1">
            <Badge variant="warning" className="text-sm">
              Abandon: {totalWaitTimeAbandonCalls}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Completed: {totalWaitTimeCompletedCalls}
            </Badge>
            <Badge variant="default" className="text-sm">
              Avg Abandon: {avgWaitTimeAbandonCalls}
            </Badge>
            <Badge variant="default" className="text-sm">
              Avg Completed: {avgWaitTimeCompletedCalls}
            </Badge>
          </div>
        }
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgLast30DaysWaitingTime;
