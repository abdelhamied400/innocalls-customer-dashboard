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

export const columns = (t: any) => [
  {
    accessorKey: "createdAt",
    header: t("activeCampaigns.columns.creationDate"),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "name",
    header: t("activeCampaigns.columns.name"),
  },
  {
    accessorKey: "durationType",
    header: t("activeCampaigns.columns.durationType"),
    cell: DurationTypeCell,
  },
  {
    accessorKey: "status",
    header: t("activeCampaigns.columns.status"),
    cell: StatusCell,
  },
  {
    header: t("activeCampaigns.columns.actions"),
    cell: ActionsCell,
  },
];
