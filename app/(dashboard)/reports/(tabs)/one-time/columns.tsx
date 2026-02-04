"use client";

import { OneTimeReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import RecipientsCell from "./cells/RecipientsCell";
import { Badge } from "@/components/ui/badge";
import SortingHead from "@/components/SortingHead";

export const columns = (): ColumnDef<OneTimeReport>[] => {
  const t = useTranslations("reports.oneTime");

  return [
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
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === "completed"
            ? "success"
            : status === "failed"
              ? "destructive"
              : "warning";
        return <Badge variant={variant}>{t(`statusValues.${status}`)}</Badge>;
      },
    },
    {
      accessorKey: "recipients",
      header: t("columns.recipients"),
      cell: RecipientsCell,
    },
  ];
};
