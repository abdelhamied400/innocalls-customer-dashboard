import { PropsWithChildren } from "react";
import AutoDialerHead from "./head";

type AutoDialerCampaignsLayoutProps = PropsWithChildren<object>;
const AutoDialerCampaignsLayout = ({
  children,
}: AutoDialerCampaignsLayoutProps) => {
  return (
    <div className="rounded-xl h-full flex flex-col gap-2 overflow-hidden">
      <AutoDialerHead />
      {children}
    </div>
  );
};

export default AutoDialerCampaignsLayout;
