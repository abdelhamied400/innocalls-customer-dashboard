"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "id",
    header: "#Ref-No",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "total",
    header: "Total",
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
