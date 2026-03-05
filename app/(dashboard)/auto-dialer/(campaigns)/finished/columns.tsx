import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";
import DurationTypeCell from "./cells/DurationTypeCell";
import { AutoDialerCampaignFinishedStatus } from "@/constants/auto-dialer";
import SortingHead from "@/components/SortingHead";

export type AutoDialerCampaignCols = {
  agentCanLogoutAndRejoin: boolean;
  assignedAgents: number[];
  createdAt: string;
  durationType: "time-limited" | "agent-availability";
  id: string;
  isDraft: boolean;
  name: string;
  status: AutoDialerCampaignFinishedStatus;
};

export const columns = (t: any): ColumnDef<any, any>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortingHead column={column}>
        {t("finishedCampaigns.columns.creationDate")}
      </SortingHead>
    ),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortingHead column={column}>
        {t("finishedCampaigns.columns.name")}
      </SortingHead>
    ),
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
