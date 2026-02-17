import {
  WaitingCall,
  InProgressCall,
  AgentDetail,
} from "@/types/autoDialerCampaign";
import { ColumnDef } from "@tanstack/react-table";

export const waitingCallsColumns = (t: any): ColumnDef<WaitingCall>[] => [
  {
    accessorKey: "waitTime",
    header: t("metrics.columns.waitTime"),
    cell: ({ row }) => `${row.original.waitTime}s`,
  },
  {
    accessorFn: (row) => row.callerInfo?.callerNumber,
    id: "callerNumber",
    header: t("metrics.columns.callerNumber"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerName,
    id: "callerName",
    header: t("metrics.columns.callerName"),
  },
];

export const inProgressCallsColumns = (
  t: any,
): ColumnDef<InProgressCall>[] => [
  {
    accessorKey: "agentId",
    header: t("metrics.columns.agentId"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerNumber,
    id: "callerNumber",
    header: t("metrics.columns.callerNumber"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerName,
    id: "callerName",
    header: t("metrics.columns.callerName"),
  },
];

export const agentDetailsColumns = (t: any): ColumnDef<AgentDetail>[] => [
  {
    accessorKey: "agentId",
    header: t("metrics.columns.agentId"),
  },
  {
    accessorKey: "status",
    header: t("metrics.columns.status"),
  },
  {
    accessorKey: "currentChannels",
    header: t("metrics.columns.currentChannels"),
    cell: ({ row }) => row.original.currentChannels?.join(", ") || "-",
  },
];
