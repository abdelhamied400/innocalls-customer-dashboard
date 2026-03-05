import { AgentCampaignCdr } from "@/types/autoDialerAgentCampaign";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";
import CustomerConnectedAtCell from "./cells/CustomerConnectedAtCell";
import AgentConnectedAtCell from "./cells/AgentConnectedAtCell";

export type AgentCampaignCdrCols = AgentCampaignCdr;

export const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: t("cdrColumns.phone"),
  },
  {
    accessorKey: "name",
    header: t("cdrColumns.name"),
  },
  {
    accessorKey: "status",
    header: t("cdrColumns.status"),
    cell: StatusCell,
  },
  {
    accessorKey: "customerConnectedAt",
    header: t("cdrColumns.customerConnectedAt"),
    cell: CustomerConnectedAtCell,
  },
  {
    accessorKey: "waitingTime",
    header: t("cdrColumns.waitingTime"),
  },
  {
    accessorKey: "talkTime",
    header: t("cdrColumns.talkTime"),
  },
  {
    accessorKey: "duration",
    header: t("cdrColumns.duration"),
  },
  {
    accessorKey: "agentConnectedAt",
    header: t("cdrColumns.agentConnectedAt"),
    cell: AgentConnectedAtCell,
  },
  {
    accessorKey: "agent",
    header: t("cdrColumns.agent"),
  },
  {
    header: t("cdrColumns.actions"),
    cell: ActionsCell,
  },
];
