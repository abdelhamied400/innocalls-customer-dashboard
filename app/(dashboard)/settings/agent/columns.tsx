"use client";

import { BreakType } from "@/types/api/break-type";
import { ColumnDef } from "@tanstack/react-table";
import BreakTypeActionsCell from "./BreakTypeActionsCell";

export const columns = (
  t: (key: string) => string
): ColumnDef<BreakType>[] => {
  return [
    {
      accessorKey: "nameAR",
      header: t("settings.agent.breaks.columns.nameAR"),
    },
    {
      accessorKey: "nameEN",
      header: t("settings.agent.breaks.columns.nameEN"),
    },
    {
      accessorKey: "actions",
      header: t("settings.agent.breaks.columns.actions"),
      cell: ({ row }) => <BreakTypeActionsCell breakType={row.original} />,
    },
  ];
};
