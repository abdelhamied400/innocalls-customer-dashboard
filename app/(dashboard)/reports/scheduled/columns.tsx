"use client";

import { ScheduledReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./cells/ActionsCell";
import RecipientsCell from "./cells/RecipientsCell";
import ScheduledCell from "./cells/ScheduledCell";
import StatusCell from "./cells/StatusCell";

export const columns = (): ColumnDef<ScheduledReport>[] => {
  const t = useTranslations("reports.scheduled.columns");

  return [
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
    },
    {
      accessorKey: "name",
      header: t("name"),
    },
    {
      accessorKey: "scheduled",
      header: t("scheduled"),
      cell: ScheduledCell,
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: StatusCell,
    },
    {
      accessorKey: "nextGeneration",
      header: t("nextGeneration"),
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
