import { PropsWithChildren } from "react";

type AutoDialerLayoutProps = PropsWithChildren<{
  createSheet: React.ReactNode;
}>;
const AutoDialerLayout = ({ children, createSheet }: AutoDialerLayoutProps) => {
  return (
    <div className="auto-dialer-layout">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl h-full overflow-auto">
        {createSheet}
        {children}
      </div>
    </div>
  );
};

export default AutoDialerLayout;
