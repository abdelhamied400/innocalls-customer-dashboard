import { PropsWithChildren } from "react";

type CallBridgeCallsLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
}>;

const CallBridgeCallsLayout = ({
  children,
  createSheet,
}: CallBridgeCallsLayoutProps) => {
  return (
    <>
      {children}
      {createSheet}
    </>
  );
};

export default CallBridgeCallsLayout;
