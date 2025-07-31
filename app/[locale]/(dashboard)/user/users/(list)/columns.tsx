"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionsCell from "./cells/ActionsCell";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";

// User type definition
export type User = {
  id: string;
  email: string;
  password: string;
  ext: string;
  name: string;
  status: string;
};

// Table columns definition
export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<User, any>[] => [
  {
    accessorKey: "ext",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.extension")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("columns.name")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: t("columns.email"),
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }: { row: any }) => (
      <Badge
        variant={row.getValue("status") === "enabled" ? "success" : "muted"}
      >
        {t(`status.${row.getValue("status")}`)}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
