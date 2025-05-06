import StatsCard, { StatsCardError } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";

const ErgTodayCallsSummary = async () => {
  try {
    const ergStats = await statsService.getErgTodayCallsSummary();
    const { total, abandon, completed } = ergStats;

    return (
      <StatsCard
        icon={
          <img
            src="/assets/icons/stats/phone.svg"
            alt="Today Calls Summary Icon"
          />
        }
        title="Today's Calls Summary"
        value={total}
        info={
          <div className="flex flex-wrap gap-1">
            <Badge variant="warning" className="text-sm">
              Abandon: {abandon}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Completed: {completed}
            </Badge>
          </div>
        }
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgTodayCallsSummary;
