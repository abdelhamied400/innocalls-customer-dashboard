"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import RecipientsCell from "./cells/RecipientsCell";
import GeneratedAtCell from "./cells/GeneratedAtCell";
import SortingHead from "@/components/SortingHead";

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<ScheduledReportHistoryItem>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortingHead column={column}>{t("columns.reportName")}</SortingHead>
      ),
      cell: ({ row }) => row.original.reportName,
    },
    {
      accessorKey: "generatedAt",
      header: ({ column }) => (
        <SortingHead column={column}>{t("columns.generatedAt")}</SortingHead>
      ),
      cell: GeneratedAtCell,
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: StatusCell,
    },
    {
      accessorKey: "recipients",
      header: t("columns.recipients"),
      cell: RecipientsCell,
    },
  ];
};
