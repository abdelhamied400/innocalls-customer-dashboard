import { ReactNode } from "react";
import { AgentCampaignCdrCols } from "../columns";
import { Cell } from "@/types/cell";

type AgentConnectedAtCellProps = Cell<AgentCampaignCdrCols, ReactNode>;
const AgentConnectedAtCell = ({ row }: AgentConnectedAtCellProps) => {
  const { agentConnectedAt } = row.original;

  return (
    <div className="flex flex-col font-normal">
      <span>{agentConnectedAt.date}</span>
      <span className="text-muted-foreground text-sm">
        {agentConnectedAt.time}
      </span>
    </div>
  );
};

export default AgentConnectedAtCell;
