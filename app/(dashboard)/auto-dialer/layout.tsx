import { PropsWithChildren } from "react";

type AutoDialerLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
  updateSheet: React.ReactNode;
}>;
const AutoDialerLayout = ({
  children,
  createSheet,
  updateSheet,
}: AutoDialerLayoutProps) => {
  return (
    <div className="auto-dialer-layout h-full">
      <div className="p-4 rounded-xl h-full bg-white">
        {createSheet}
        {updateSheet}
        {children}
      </div>
    </div>
  );
};

export default AutoDialerLayout;
