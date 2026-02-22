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

export const columns = (t: any): ColumnDef<any, any>[] => [
  {
    accessorKey: "createdAt",
    header: t("finishedCampaigns.columns.creationDate"),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: t("finishedCampaigns.columns.name"),
  },
  {
    accessorKey: "durationType",
    header: t("finishedCampaigns.columns.durationType"),
    cell: DurationTypeCell,
  },
  {
    accessorKey: "status",
    header: t("finishedCampaigns.columns.status"),
    cell: StatusCell,
  },
  {
    header: t("finishedCampaigns.columns.actions"),
    cell: ActionsCell,
  },
];
