"use client";

import { PropsWithChildren } from "react";

type ScheduledReportLayoutProps = PropsWithChildren<{
  createReportSheet: React.ReactNode;
  editReportSheet: React.ReactNode;
}>;

const ScheduledReportLayout = ({
  children,
  createReportSheet,
  editReportSheet,
}: ScheduledReportLayoutProps) => {
  return (
    <>
      {children}
      {createReportSheet}
      {editReportSheet}
    </>
  );
};

export default ScheduledReportLayout;
