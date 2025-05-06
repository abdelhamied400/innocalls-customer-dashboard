import { PropsWithChildren, ReactNode } from "react";

type OverviewLayoutProps = PropsWithChildren<{
  callDistribution: ReactNode;
  totalCalls: ReactNode;
  liveCallsCount: ReactNode;
  lastHourCallsDuration: ReactNode;
  todayCallsDuration: ReactNode;
  ErgInProgressCallsCount: ReactNode;
  ErgTodayCallsSummary: ReactNode;
  ErgLast30DaysCallsSummary: ReactNode;
  ErgTodayTalkTime: ReactNode;
  ErgLast30DaysTalkTime: ReactNode;
  ErgTodayWaitingTime: ReactNode;
  ErgLast30DaysWaitingTime: ReactNode;
  ErgWaitingCallsCount: ReactNode;
}>;
const OverviewLayout = ({
  children,
  callDistribution,
  totalCalls,
  liveCallsCount,
  lastHourCallsDuration,
  todayCallsDuration,
  ErgInProgressCallsCount,
  ErgTodayCallsSummary,
  ErgLast30DaysCallsSummary,
  ErgTodayTalkTime,
  ErgLast30DaysTalkTime,
  ErgTodayWaitingTime,
  ErgLast30DaysWaitingTime,
  ErgWaitingCallsCount,
}: OverviewLayoutProps) => {
  return (
    <div className="layout" id="overview-layout">
      <h3>Service Level Details</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {liveCallsCount}
        {lastHourCallsDuration}
        {todayCallsDuration}
      </div>

      <div className="gap-y-4 grid grid-cols-1 xl:gap-4 xl:grid-cols-3 py-4">
        <div className="col-span-2 max-h-[320px]">{callDistribution}</div>
        <div className="col-span-1 max-h-[320px]">{totalCalls}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {ErgInProgressCallsCount}
        {ErgWaitingCallsCount}
        {ErgTodayCallsSummary}
        {ErgLast30DaysCallsSummary}
        {ErgTodayTalkTime}
        {ErgLast30DaysTalkTime}
        {ErgTodayWaitingTime}
        {ErgLast30DaysWaitingTime}
      </div>
      {children}
    </div>
  );
};

export default OverviewLayout;
