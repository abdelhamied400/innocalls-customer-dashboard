import StatsCard, { StatsCardError } from "@/components/StatsCard";
import statsService from "@/services/stats.service";

const ErgWaitingCallsCount = async () => {
  try {
    const ergStats = await statsService.getErgWaitingCallsCount();
    const { calls } = ergStats;

    return (
      <StatsCard
        icon={
          <img src="/assets/icons/stats/phone.svg" alt="Waiting Calls Icon" />
        }
        title="Waiting Calls Count"
        value={calls.length}
      ></StatsCard>
    );
  } catch (error) {
    return <StatsCardError error={error} />;
  }
};

export default ErgWaitingCallsCount;
