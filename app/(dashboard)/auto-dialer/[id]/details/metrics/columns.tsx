import {
  WaitingCall,
  InProgressCall,
  AgentDetail,
  InitiatedCall,
} from "@/types/autoDialerCampaign";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@mui/material";
import Image from "next/image";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    __rowType?: TData;
    onSpy?: (ext: string) => void;
    currentExtension?: string;
  }
}

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

export const inProgressCallsColumns = (t: any): ColumnDef<InProgressCall>[] => [
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
  {
    id: "actions",
    header: t("metrics.columns.actions"),
    cell: ({ row, table }) => {
      const agentExtension = row.original.agentId;
      const currentExtension = table.options.meta?.currentExtension;

      if (!agentExtension || currentExtension === agentExtension) {
        return null;
      }

      return (
        <Tooltip title={t("metrics.tooltips.spy")} arrow>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.options.meta?.onSpy?.(agentExtension)}
          >
            <Image
              src="/assets/icons/incognito.svg"
              alt="spy"
              width={24}
              height={24}
            />
          </Button>
        </Tooltip>
      );
    },
  },
];

export const initiatedCallsColumns = (
  t: any,
): ColumnDef<InitiatedCall>[] => [
  {
    accessorKey: "phone",
    header: t("metrics.columns.phone"),
  },
  {
    accessorKey: "name",
    header: t("metrics.columns.customerName"),
  },
  {
    accessorKey: "currentTrial",
    header: t("metrics.columns.currentTrial"),
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
