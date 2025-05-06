import StatsCard, { StatsCardError } from "@/components/StatsCard";
import { Badge } from "@/components/ui/badge";
import statsService from "@/services/stats.service";

const ErgLast30DaysCallsSummary = async () => {
  try {
    const ergStats = await statsService.getErgLast30DaysCallsSummary();
    const { total, abandon, completed } = ergStats;

    return (
      <StatsCard
        icon={
          <img
            src="/assets/icons/stats/phone.svg"
            alt="Last 30 Days Calls Summary Icon"
          />
        }
        title="Last 30 Days Calls Summary"
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

export default ErgLast30DaysCallsSummary;
