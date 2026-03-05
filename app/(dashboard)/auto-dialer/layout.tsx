import { PropsWithChildren } from "react";

type AutodialerLayoutProps = PropsWithChildren<{}>;
const AutodialerLayout = ({ children }: AutodialerLayoutProps) => {
  return <div className="auto-dialer-layout">{children}</div>;
};

export default AutodialerLayout;
