import { PropsWithChildren } from "react";

type AutoDialerLayoutProps = PropsWithChildren<object>;
const AutoDialerLayout = ({ children }: AutoDialerLayoutProps) => {
  return (
    <div className="auto-dialer-layout">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-xl h-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AutoDialerLayout;
