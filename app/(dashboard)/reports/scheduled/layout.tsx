"use client";

import { PropsWithChildren } from "react";

type ScheduledReportLayoutProps = PropsWithChildren<{
  createReportSheet: React.ReactNode;
}>;

const ScheduledReportLayout = ({
  children,
  createReportSheet,
}: ScheduledReportLayoutProps) => {
  return (
    <>
      {children}
      {createReportSheet}
    </>
  );
};

export default ScheduledReportLayout;
