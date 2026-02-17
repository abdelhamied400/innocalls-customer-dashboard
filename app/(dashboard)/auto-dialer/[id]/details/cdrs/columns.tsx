import { CampaignCdr } from "@/types/autoDialerCampaign";
import CustomerConnectedAtCell from "./cells/CustomerConnectedAtCell";
import StatusCell from "./cells/StatusCell";
import AgentConnectedAtCell from "./cells/AgentConnectedAtCell";
import ActionsCell from "./cells/ActionsCell";

export type CampaignCdrsCols = CampaignCdr;

export const columns = (t: any) => [
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    accessorKey: "customerConnectedAt",
    header: "Customer Connected At",
    cell: CustomerConnectedAtCell,
  },
  {
    accessorKey: "waitingTime",
    header: "Waiting Time",
  },
  {
    accessorKey: "talkTime",
    header: "Talk Time",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "agentConnectedAt",
    header: "Agent Connected At",
    cell: AgentConnectedAtCell,
  },
  {
    accessorKey: "agent",
    header: "Agent",
  },
  {
    header: "Actions",
    cell: ActionsCell,
  },
];
