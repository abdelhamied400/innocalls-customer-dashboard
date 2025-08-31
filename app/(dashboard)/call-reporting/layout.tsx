import { PropsWithChildren } from "react";

type CallReportingLayoutProps = PropsWithChildren<{}>;
const CallReportingLayout = ({ children }: CallReportingLayoutProps) => {
  return (
    <div className="bg-white rounded-xl p-4 h-full">
      <div className="h-full rounded-xl border">{children}</div>
    </div>
  );
};

export default CallReportingLayout;
