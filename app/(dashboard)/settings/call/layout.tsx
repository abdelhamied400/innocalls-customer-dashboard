"use client";

import { PropsWithChildren } from "react";

type CallSettingsLayoutProps = PropsWithChildren<{
  editTagSheet: React.ReactNode;
}>;

const CallSettingsLayout = ({
  children,
  editTagSheet,
}: CallSettingsLayoutProps) => {
  return (
    <>
      {children}
      {editTagSheet}
    </>
  );
};

export default CallSettingsLayout;
