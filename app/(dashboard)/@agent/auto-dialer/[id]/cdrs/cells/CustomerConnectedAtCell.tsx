import { ReactNode } from "react";
import { AgentCampaignCdrCols } from "../columns";
import { Cell } from "@/types/cell";

type CustomerConnectedAtCellProps = Cell<AgentCampaignCdrCols, ReactNode>;
const CustomerConnectedAtCell = ({ row }: CustomerConnectedAtCellProps) => {
  const { customerConnectedAt } = row.original;

  return (
    <div className="flex flex-col font-normal">
      <span>{customerConnectedAt.date}</span>
      <span className="text-muted-foreground text-sm">
        {customerConnectedAt.time}
      </span>
    </div>
  );
};

export default CustomerConnectedAtCell;
