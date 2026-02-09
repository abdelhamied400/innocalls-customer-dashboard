"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import RecipientsCell from "./cells/RecipientsCell";
import GeneratedAtCell from "./cells/GeneratedAtCell";
import SortingHead from "@/components/SortingHead";

export const columns = (): ColumnDef<ScheduledReportHistoryItem>[] => {
  const t = useTranslations("reports.scheduled.history.columns");

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortingHead column={column}>{t("reportName")}</SortingHead>
      ),
      cell: ({ row }) => row.original.reportName,
    },
    {
      accessorKey: "generatedAt",
      header: ({ column }) => (
        <SortingHead column={column}>{t("generatedAt")}</SortingHead>
      ),
      cell: GeneratedAtCell,
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: StatusCell,
    },
    {
      accessorKey: "recipients",
      header: t("recipients"),
      cell: RecipientsCell,
    },
  ];
};
