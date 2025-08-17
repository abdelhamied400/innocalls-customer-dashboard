import { PropsWithChildren } from "react";

type NumbersLayoutProps = PropsWithChildren<{}>;
const NumbersLayout = ({ children }: NumbersLayoutProps) => {
  return (
    <div className="bg-white rounded-xl p-4 h-full">
      <div className="h-full rounded-xl border">{children}</div>
    </div>
  );
};

export default NumbersLayout;
