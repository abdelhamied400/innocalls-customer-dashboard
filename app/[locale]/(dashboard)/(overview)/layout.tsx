import { PropsWithChildren, ReactNode } from "react";

type OverviewLayoutProps = PropsWithChildren<{
  callDistribution: ReactNode;
  totalCalls: ReactNode;
}>;
const OverviewLayout = ({
  children,
  callDistribution,
  totalCalls,
}: OverviewLayoutProps) => {
  return (
    <div className="layout" id="overview-layout">
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 py-4">
        {callDistribution}
        {totalCalls}
      </div>
      {children}
    </div>
  );
};

export default OverviewLayout;
