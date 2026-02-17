import { ReactNode } from "react";
import { CampaignCdrsCols } from "../columns";
import { Cell } from "@/types/cell";

type AgentConnectedAtCellProps = Cell<CampaignCdrsCols, ReactNode>;
const AgentConnectedAtCell = ({ cell, row }: AgentConnectedAtCellProps) => {
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
