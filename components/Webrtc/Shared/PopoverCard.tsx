import { PropsWithChildren } from "react";

type PopoverCardProps = PropsWithChildren<{}>;
const PopoverCard = ({ children }: PopoverCardProps) => {
  return <div className="popover-card">{children}</div>;
};

type PopoverCardHeaderProps = PropsWithChildren<{}>;
export const PopoverCardHeader = ({ children }: PopoverCardHeaderProps) => {
  return (
    <div className="popover-card-header bg-gray-100 p-3 border-b flex items-center justify-between">
      {children}
    </div>
  );
};

type PopoverCardContentProps = PropsWithChildren<{}>;
export const PopoverCardContent = ({ children }: PopoverCardContentProps) => {
  return (
    <div className="popover-card-content p-3 h-96 overflow-y-auto">
      {children}
    </div>
  );
};

export default PopoverCard;
