"use client";

import { OneTimeReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./cells/ActionsCell";
import RecipientsCell from "./cells/RecipientsCell";

export const columns = (): ColumnDef<OneTimeReport>[] => {
  const t = useTranslations("reports.oneTime.columns");

  return [
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
    },
    {
      accessorKey: "report",
      header: t("report"),
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
