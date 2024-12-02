import { useTranslations } from "next-intl";
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
  const t = useTranslations("HomePage");

  return (
    <div className="layout" id="overview-layout">
      <h1>{t("title")}</h1>

      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2 py-4">
        {callDistribution}
        {totalCalls}
      </div>
      {children}
    </div>
  );
};

export default OverviewLayout;
