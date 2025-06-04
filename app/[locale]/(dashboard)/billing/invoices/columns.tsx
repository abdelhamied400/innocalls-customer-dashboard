"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon } from "lucide-react";

export type Invoice = {
  currencyCode: string;
  date: string;
  email: string;
  id: string;
  number: string;
  status: string;
  total: number;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "number",
    header: "#Ref-No",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      const currencyCode = row.original.currencyCode as string;
      return (
        <div className="flex flex-col items-center w-min font-normal">
          <p>{total}</p>
          <p className="text-gray-500">{currencyCode}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={status === "paid" ? "success" : "destructive"}>
            {status}
          </Badge>
        </div>
      );
    },
  },
];
