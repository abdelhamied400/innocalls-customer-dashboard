import { PropsWithChildren } from "react";

type ActiveCallSurveysLayoutProps = PropsWithChildren<{
  analyticsSheet: React.ReactNode;
  metricsSheet: React.ReactNode;
}>;

const ActiveCallSurveysLayout = ({
  children,
  analyticsSheet,
  metricsSheet,
}: ActiveCallSurveysLayoutProps) => {
  return (
    <>
      {children}
      {analyticsSheet}
      {metricsSheet}
    </>
  );
};

export default ActiveCallSurveysLayout;
