"use client";

import SortingHead from "@/components/SortingHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";
import Image from "next/image";
import { AgentActivity } from "@/types/webrtc";
import { agentActivitiesColors } from "@/constants/agent-activity";
import { cn } from "@/lib/utils";
import ExpandCell from "@/components/ExpandCell";

// Extend TableMeta
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {}
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AgentPerformance = {
  callStatistics: Array<{
    answeredCalls: number;
    date: string;
    firstAnsweredCall: string | null;
    firstCall: string;
    latestAnsweredCall: string | null;
    latestCall: string;
    longestCall: string;
    shortestCall: string;
    totalCalls: number;
    totalTalkTime: string;
    totalTalkTimeSeconds: number;
  }>;
  ext: string;
  firstBreakStarted: string | null;
  firstLoggedIn: string | null;
  id: string;
  latestActivity: {
    datetime: string;
    subType: string;
    type: AgentActivity;
  } | null;
  name: string;
  totalBreaks: number;
};

export const columns = (
  t: ReturnType<typeof useTranslations>,
  webrtcT: ReturnType<typeof useTranslations>
): ColumnDef<AgentPerformance>[] => [
  {
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.name")}</SortingHead>
    ),
    cell: ({ row }) => {
      return (
        <div className="name-cell flex items-center gap-1">
          <ExpandCell row={row} />
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "ext",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.extension")}</SortingHead>
    ),
  },
  {
    accessorKey: "latestActivity",
    header: t("columns.latestActivity"),
    cell: ({ row }) => {
      const latestActivity = row.original.latestActivity;
      if (!latestActivity) {
        return "";
      }
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {latestActivity.type && (
              <Badge
                variant="outline"
                className="px-2 py-1 text-sm font-medium capitalize"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn("w-2 h-2 rounded-full")}
                    style={{
                      backgroundColor:
                        agentActivitiesColors[latestActivity.type],
                    }}
                  />
                  {t(`activity.type.${latestActivity.type}`)}
                </div>
              </Badge>
            )}
            {latestActivity.subType && (
              <Badge
                variant="outline"
                className="px-2 py-1 text-sm font-medium capitalize"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn("w-2 h-2 rounded-full")}
                    style={{
                      backgroundColor:
                        agentActivitiesColors[latestActivity.type],
                    }}
                  />
                  {webrtcT(
                    `activity.breakTypes.${latestActivity.subType.toLowerCase()}`
                  ) !==
                  `activity.breakTypes.${latestActivity.subType.toLowerCase()}`
                    ? webrtcT(
                        `activity.breakTypes.${latestActivity.subType.toLowerCase()}`
                      )
                    : latestActivity.subType}
                </div>
              </Badge>
            )}
          </div>
          <p className="text-gray-500">{latestActivity.datetime}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "firstLoggedIn",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.firstLoggedIn")}</SortingHead>
    ),
    cell: ({ row }) => {
      return row.original.firstLoggedIn ? row.original.firstLoggedIn : "-";
    },
  },
  {
    accessorKey: "firstBreakStarted",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>
        {t("columns.firstBreakStarted")}
      </SortingHead>
    ),
    cell: ({ row }) => {
      return row.original.firstBreakStarted
        ? row.original.firstBreakStarted
        : "-";
    },
  },
  {
    accessorKey: "totalBreaks",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.totalBreaks")}</SortingHead>
    ),
    cell: ({ row }) => {
      return row.original.totalBreaks;
    },
  },
];
