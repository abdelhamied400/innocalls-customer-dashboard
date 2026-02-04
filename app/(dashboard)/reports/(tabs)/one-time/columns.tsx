"use client";

import { OneTimeReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import RecipientsCell from "./cells/RecipientsCell";
import { Badge } from "@/components/ui/badge";
import SortingHead from "@/components/SortingHead";

export const columns = (): ColumnDef<OneTimeReport>[] => {
  const t = useTranslations("reports.oneTime.columns");

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
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === "completed"
            ? "success"
            : status === "failed"
              ? "destructive"
              : "warning";
        return <Badge variant={variant}>{t(`status.${status}`)}</Badge>;
      },
    },
    {
      accessorKey: "recipients",
      header: t("recipients"),
      cell: RecipientsCell,
    },
  ];
};
