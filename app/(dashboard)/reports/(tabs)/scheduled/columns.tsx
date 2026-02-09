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

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<ScheduledReport>[] => [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortingHead column={column}>{t("columns.createdAt")}</SortingHead>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortingHead column={column}>{t("columns.name")}</SortingHead>
    ),
  },
  {
    accessorKey: "frequency",
    header: t("columns.scheduled"),
    cell: ScheduledCell,
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: StatusCell,
  },
  {
    accessorKey: "nextGenerationDate",
    header: ({ column }) => (
      <SortingHead column={column}>{t("columns.nextGeneration")}</SortingHead>
    ),
    cell: NextGenerationCell,
  },
  {
    accessorKey: "recipients",
    header: t("columns.recipients"),
    cell: RecipientsCell,
  },
  {
    accessorKey: "actions",
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
