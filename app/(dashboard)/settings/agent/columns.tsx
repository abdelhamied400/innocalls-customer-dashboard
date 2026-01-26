"use client";

import { BreakType } from "@/types/api/break-type";
import { ColumnDef } from "@tanstack/react-table";
import BreakTypeActionsCell from "./BreakTypeActionsCell";

export const columns = (
  t: (key: string) => string
): ColumnDef<BreakType>[] => {
  return [
    {
      accessorKey: "breakType",
      header: t("settings.agent.breaks.columns.breakType"),
      cell: ({ row }) => {
        const locale = localStorage.getItem("app-locale") || "en";
        return locale === "ar" ? row.original.nameAR : row.original.nameEN;
      },
    },
    {
      accessorKey: "actions",
      header: t("settings.agent.breaks.columns.actions"),
      cell: ({ row }) => <BreakTypeActionsCell breakType={row.original} />,
    },
  ];
};
