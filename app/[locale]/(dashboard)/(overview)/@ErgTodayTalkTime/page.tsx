import StatsCard, { StatsCardError } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";

const ErgTodayTalkTime = async () => {
  try {
    const ergStats = await statsService.getErgTodayTalkTime();
    const { average, total } = ergStats;

    return (
      <StatsCard
        icon={
          <img src="/assets/icons/stats/phone.svg" alt="Today Talk Time Icon" />
        }
        title="Today's Talk Time"
        value={total}
        info={
          <div className="flex flex-wrap gap-1">
            <Badge variant="default" className="text-sm">
              Average: {average}
            </Badge>
          </div>
        }
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgTodayTalkTime;
