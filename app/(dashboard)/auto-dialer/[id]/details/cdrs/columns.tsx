import { CampaignCdr } from "@/types/autoDialerCampaign";
import CustomerConnectedAtCell from "./cells/CustomerConnectedAtCell";
import StatusCell from "./cells/StatusCell";
import AgentConnectedAtCell from "./cells/AgentConnectedAtCell";
import ActionsCell from "./cells/ActionsCell";

export type CampaignCdrsCols = CampaignCdr;

export const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: t("columns.phone"),
  },
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
    accessorKey: "customerConnectedAt",
    header: t("columns.customerConnectedAt"),
    cell: CustomerConnectedAtCell,
  },
  {
    accessorKey: "waitingTime",
    header: t("columns.waitingTime"),
  },
  {
    accessorKey: "talkTime",
    header: t("columns.talkTime"),
  },
  {
    accessorKey: "duration",
    header: t("columns.duration"),
  },
  {
    accessorKey: "agentConnectedAt",
    header: t("columns.agentConnectedAt"),
    cell: AgentConnectedAtCell,
  },
  {
    accessorKey: "agent",
    header: t("columns.agent"),
  },
  {
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
