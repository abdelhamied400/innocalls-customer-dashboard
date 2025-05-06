import StatsCard, { StatsCardError } from "@/components/StatsCard";
import statsService from "@/services/stats.service";

const ErgInProgressCallsCount = async () => {
  try {
    const ergStats = await statsService.getErgInProgressCallsCount();

    return (
      <StatsCard
        icon={<img src="/assets/icons/stats/phone.svg" alt="Live Calls Icon" />}
        title="In Progress Calls Count"
        value={ergStats?.inProgressCallsCount}
        className="bg-blue-100 shadow-none"
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgInProgressCallsCount;
