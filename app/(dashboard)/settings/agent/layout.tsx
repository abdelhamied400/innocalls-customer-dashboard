"use client";

import { PropsWithChildren } from "react";

type AgentSettingsLayoutProps = PropsWithChildren<{
  createBreakSheet: React.ReactNode;
  editBreakSheet: React.ReactNode;
}>;

const AgentSettingsLayout = ({
  children,
  createBreakSheet,
  editBreakSheet,
}: AgentSettingsLayoutProps) => {
  return (
    <>
      {children}
      {createBreakSheet}
      {editBreakSheet}
    </>
  );
};

export default AgentSettingsLayout;
