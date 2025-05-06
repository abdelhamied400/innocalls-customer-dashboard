import StatsCard, { StatsCardError } from "@/components/StatsCard";
import statsService from "@/services/stats.service";
import { unstable_noStore } from "next/cache";

const ErgInProgressCallsCount = async () => {
  unstable_noStore();
  try {
    const ergStats = await statsService.getErgInProgressCallsCount();
    const { inProgressCallsCount } = ergStats;

    console.log("In Progress Calls Count:", inProgressCallsCount);

    return (
      <StatsCard
        icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
        title="In Progress Calls Count"
        value={inProgressCallsCount}
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgInProgressCallsCount;
