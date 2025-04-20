import { useTranslations } from "next-intl";
import { PropsWithChildren, ReactNode } from "react";

type OverviewLayoutProps = PropsWithChildren<{
  callDistribution: ReactNode;
  totalCalls: ReactNode;
  liveCallsCount: ReactNode;
  lastHourCallsDuration: ReactNode;
  todayCallsDuration: ReactNode;
}>;
const OverviewLayout = ({
  children,
  callDistribution,
  totalCalls,
  liveCallsCount,
  lastHourCallsDuration,
  todayCallsDuration,
}: OverviewLayoutProps) => {
  const t = useTranslations("HomePage");

  return (
    <div className="layout" id="overview-layout">
      <h3>Service Level Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {liveCallsCount}
        {lastHourCallsDuration}
        {todayCallsDuration}
      </div>

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3 py-4">
        <div className="col-span-2 max-h-[320px]">{callDistribution}</div>
        <div className="col-span-1 max-h-[320px]">{totalCalls}</div>
      </div>
      {children}
    </div>
  );
};

export default OverviewLayout;
