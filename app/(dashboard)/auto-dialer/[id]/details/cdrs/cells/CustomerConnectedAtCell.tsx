import { ReactNode } from "react";
import { CampaignCdrsCols } from "../columns";
import { Cell } from "@/types/cell";

type CustomerConnectedAtCellProps = Cell<CampaignCdrsCols, ReactNode>;
const CustomerConnectedAtCell = ({
  cell,
  row,
}: CustomerConnectedAtCellProps) => {
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
