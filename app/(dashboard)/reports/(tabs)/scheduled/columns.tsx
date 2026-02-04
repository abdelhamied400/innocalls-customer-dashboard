"use client";

import { ScheduledReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./cells/ActionsCell";
import RecipientsCell from "./cells/RecipientsCell";
import ScheduledCell from "./cells/ScheduledCell";
import StatusCell from "./cells/StatusCell";
import NextGenerationCell from "./cells/NextGenerationCell";
import SortingHead from "@/components/SortingHead";

export const columns = (): ColumnDef<ScheduledReport>[] => {
  const t = useTranslations("reports.scheduled.columns");

  return [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortingHead column={column}>{t("createdAt")}</SortingHead>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortingHead column={column}>{t("name")}</SortingHead>
      ),
    },
    {
      accessorKey: "frequency",
      header: t("scheduled"),
      cell: ScheduledCell,
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: StatusCell,
    },
    {
      accessorKey: "nextGenerationDate",
      header: ({ column }) => (
        <SortingHead column={column}>{t("nextGeneration")}</SortingHead>
      ),
      cell: NextGenerationCell,
    },
    {
      accessorKey: "recipients",
      header: t("recipients"),
      cell: RecipientsCell,
    },
    {
      accessorKey: "actions",
      header: t("actions"),
      cell: ActionsCell,
    },
  ];
};
