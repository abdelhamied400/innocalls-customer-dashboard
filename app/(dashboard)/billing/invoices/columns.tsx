"use client";

import SortingHead from "@/components/SortingHead";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";
import TotalCell from "./cells/TotalCell";
import RemainingCell from "./cells/RemainingCell";
import StatusCell from "./cells/StatusCell";
import ActionsCell from "./cells/ActionsCell";

export type Invoice = {
  currencyCode: string;
  date: string;
  email: string;
  id: string;
  number: string;
  status: string;
  total: number;
  remaining: number;
};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<Invoice>[] => [
    {
      accessorKey: "number",
      header: t("columns.refNo"),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <SortingHead column={column}>{t("columns.date")}</SortingHead>
      ),
    },
    {
      accessorKey: "email",
      header: t("columns.email"),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <SortingHead column={column}>{t("columns.total")}</SortingHead>
      ),
      cell: TotalCell,
    },
    {
      accessorKey: "remaining",
      header: t("columns.remaining"),
      cell: RemainingCell,
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: StatusCell,
    },
    {
      accessorKey: "actions",
      header: t("columns.actions"),
      cell: ActionsCell,
    },
  ];
