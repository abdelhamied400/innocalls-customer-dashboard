"use client";

import SortingHead from "@/components/SortingHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, RowData } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";
import Image from "next/image";

// Extend TableMeta
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {}
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AgentPerformance = {};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<AgentPerformance>[] => [
  {
    accessorKey: "ext",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.extension")}</SortingHead>
    ),
  },
];
