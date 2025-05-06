import { Suspense } from "react";
import ErgInProgressCallsCount from "./ErgInProgressCallsCount";
import ErgWaitingCallsCount from "./ErgWaitingCallsCount";
import ErgLast30DaysCallsSummary from "./ErgLast30DaysCallsSummary";
import ErgLast30DaysTalkTime from "./ErgLast30DaysTalkTime";
import ErgLast30DaysWaitingTime from "./ErgLast30DaysWaitingTime";
import ErgTodayCallsSummary from "./ErgTodayCallsSummary";
import ErgTodayTalkTime from "./ErgTodayTalkTime";
import ErgTodayWaitingTime from "./ErgTodayWaitingTime";
import { StatsCardSkeleton } from "@/components/StatsCard";

const Dashboard = () => {
  return (
    <div className="page" id="dashboard">
      <h1>Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgInProgressCallsCount />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgWaitingCallsCount />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgTodayCallsSummary />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgTodayTalkTime />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgTodayWaitingTime />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgLast30DaysCallsSummary />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgLast30DaysTalkTime />
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <ErgLast30DaysWaitingTime />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
