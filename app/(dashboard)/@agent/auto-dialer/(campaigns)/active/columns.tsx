import { AgentCampaign } from "@/types/autoDialerAgentCampaign";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";

export type AgentCampaignCols = AgentCampaign;

export const columns = (t: any) => [
  {
    accessorKey: "name",
    header: t("columns.name"),
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: StatusCell,
  },
  {
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
