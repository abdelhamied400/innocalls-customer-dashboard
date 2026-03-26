import { PropsWithChildren } from "react";

type CallBridgeLayoutProps = PropsWithChildren<{}>;
const CallBridgeLayout = ({ children }: CallBridgeLayoutProps) => {
  return <div className="call-bridge-layout">{children}</div>;
};

export default CallBridgeLayout;
