import { PropsWithChildren } from "react";

type OneTimeLayoutProps = PropsWithChildren<{
  createReportSheet: React.ReactNode;
}>;

const OneTimeLayout = ({ children, createReportSheet }: OneTimeLayoutProps) => {
  return (
    <>
      {children}
      {createReportSheet}
    </>
  );
};

export default OneTimeLayout;
