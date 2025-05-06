import StatsCard, { StatsCardError } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";

const ErgLast30DaysTalkTime = async () => {
  try {
    const ergStats = await statsService.getErgLast30DaysTalkTime();
    const { average, total } = ergStats;

    return (
      <StatsCard
        icon={
          <img
            src="/assets/icons/stats/phone.svg"
            alt="Last 30 Days Talk Time Icon"
          />
        }
        title="Last 30 Days Talk Time"
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

export default ErgLast30DaysTalkTime;
