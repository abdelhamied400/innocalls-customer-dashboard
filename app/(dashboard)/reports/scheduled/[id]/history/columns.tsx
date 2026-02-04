"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import StatusCell from "./cells/StatusCell";
import RecipientsCell from "./cells/RecipientsCell";
import ScheduledForCell from "./cells/ScheduledForCell";
import CompletedAtCell from "./cells/CompletedAtCell";

export const columns = (): ColumnDef<ScheduledReportHistoryItem>[] => {
  const t = useTranslations("reports.scheduled.history.columns");

  return [
    {
      accessorKey: "scheduledFor",
      header: t("scheduledFor"),
      cell: ScheduledForCell,
    },
    // {
    //   accessorKey: "completedAt",
    //   header: t("completedAt"),
    //   cell: CompletedAtCell,
    // },
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
