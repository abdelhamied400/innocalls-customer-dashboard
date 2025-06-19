import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";
import DurationTypeCell from "./cells/DurationTypeCell";
import { AutoDialerCampaignActiveStatus } from "@/constants/auto-dialer";

export type AutoDialerCampaignCols = {
  agentCanLogoutAndRejoin: boolean;
  assignedAgents: number[];
  createdAt: string;
  durationType: "time-limited" | "agent-availability";
  id: string;
  isDraft: boolean;
  name: string;
  status: AutoDialerCampaignActiveStatus;
};

export const columns: ColumnDef<any, any>[] = [
  {
    accessorKey: "createdAt",
    header: "Creation Date",
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "durationType",
    header: "Duration Type",
    cell: DurationTypeCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    header: "Actions",
    cell: ActionsCell,
  },
];
