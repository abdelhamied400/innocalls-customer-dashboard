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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SortingHead from "@/components/SortingHead";
import { formatDuration } from "@/lib/date";

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
    cell: ({ row }) =>
      `${formatDuration(row.original.waitTime / 1000, {
        showHours: false,
      })}`,
  },
  {
    accessorFn: (row) => row.callerInfo?.callerNumber,
    id: "callerNumber",
    header: t("metrics.columns.callerNumber"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerName,
    id: "callerName",
    header: ({ column }) => (
      <SortingHead column={column}>
        {t("metrics.columns.callerName")}
      </SortingHead>
    ),
  },
];

export const inProgressCallsColumns = (t: any): ColumnDef<InProgressCall>[] => [
  {
    accessorKey: "agentId",
    header: t("metrics.columns.agentId"),
  },
  {
    accessorKey: "name",
    header: t("metrics.columns.agentName"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerNumber,
    id: "callerNumber",
    header: t("metrics.columns.callerNumber"),
  },
  {
    accessorFn: (row) => row.callerInfo?.callerName,
    id: "callerName",
    header: ({ column }) => (
      <SortingHead column={column}>
        {t("metrics.columns.callerName")}
      </SortingHead>
    ),
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

export const initiatedCallsColumns = (t: any): ColumnDef<InitiatedCall>[] => [
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

export const AGENT_STATUSES: AgentDetail["status"][] = [
  "offline",
  "on-break",
  "busy",
  "available",
];

export const agentStatusClassNames: Record<AgentDetail["status"], string> = {
  offline: "bg-gray-200 text-gray-700 hover:bg-gray-200",
  "on-break": "bg-purple-200 text-purple-700 hover:bg-purple-200",
  busy: "bg-red-200 text-red-700 hover:bg-red-200",
  available: "bg-green-200 text-green-700 hover:bg-green-200",
};

export const agentStatusDotColors: Record<AgentDetail["status"], string> = {
  offline: "bg-gray-400",
  "on-break": "bg-purple-400",
  busy: "bg-red-400",
  available: "bg-green-400",
};

export const agentDetailsColumns = (t: any): ColumnDef<AgentDetail>[] => [
  {
    accessorKey: "name",
    header: t("metrics.columns.agentName"),
  },
  {
    accessorKey: "agentId",
    header: t("metrics.columns.agentId"),
  },
  {
    accessorKey: "status",
    header: t("metrics.columns.status"),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn("border-0", agentStatusClassNames[status])}>
          {t(`metrics.columns.agentStatuses.${status}`)}
        </Badge>
      );
    },
  },
];
