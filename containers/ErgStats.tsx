import ErgInProgressCallsCount from "@/components/Stats/ErgInProgressCallsCount";
import ErgLast30DaysCallsSummary from "@/components/Stats/ErgLast30DaysCallsSummary";
import ErgLast30DaysTalkTime from "@/components/Stats/ErgLast30DaysTalkTime";
import ErgLast30DaysWaitingTime from "@/components/Stats/ErgLast30DaysWaitingTime";
import ErgTodayCallsSummary from "@/components/Stats/ErgTodayCallsSummary";
import ErgTodayTalkTime from "@/components/Stats/ErgTodayTalkTime";
import ErgTodayWaitingTime from "@/components/Stats/ErgTodayWaitingTime";
import ErgWaitingCallsCount from "@/components/Stats/ErgWaitingCallsCount";

const ErgStats = () => {
  return (
    <div className="erg-stats">
      <h3>Queue Statistics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <ErgInProgressCallsCount />
        <ErgWaitingCallsCount />
        <ErgTodayCallsSummary />
        <ErgLast30DaysCallsSummary />
        <ErgTodayTalkTime />
        <ErgLast30DaysTalkTime />
        <ErgTodayWaitingTime />
        <ErgLast30DaysWaitingTime />
      </div>
    </div>
  );
};

export default ErgStats;
