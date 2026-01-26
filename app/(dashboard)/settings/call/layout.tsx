"use client";

import { PropsWithChildren } from "react";

type CallSettingsLayoutProps = PropsWithChildren<{
  editTagSheet: React.ReactNode;
  createTagSheet: React.ReactNode;
}>;

const CallSettingsLayout = ({
  children,
  editTagSheet,
  createTagSheet,
}: CallSettingsLayoutProps) => {
  return (
    <>
      {children}
      {editTagSheet}
      {createTagSheet}
    </>
  );
};

export default CallSettingsLayout;
