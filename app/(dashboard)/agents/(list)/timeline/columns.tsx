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
export type AgentTimeline = {
  id: string;
  ext: number;
  name: string;
  activities: Array<{
    timestamp: string;
    unixTimestamp: number;
    type: AgentActivity;
    subType: string;
    eventType: string;
  }>;
};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<AgentTimeline>[] => [
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
];
