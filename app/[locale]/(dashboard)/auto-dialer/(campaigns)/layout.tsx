import { PropsWithChildren } from "react";
import AutoDialerHead from "./head";

type AutoDialerCampaignsLayoutProps = PropsWithChildren<object>;
const AutoDialerCampaignsLayout = ({
  children,
}: AutoDialerCampaignsLayoutProps) => {
  return (
    <>
      <AutoDialerHead />
      {children}
    </>
  );
};

export default AutoDialerCampaignsLayout;
