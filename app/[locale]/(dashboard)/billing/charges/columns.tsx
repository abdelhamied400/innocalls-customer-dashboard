"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Charge = {
  amount: number;
  currency: string;
  date: string;
  description: string;
  gateway: string | null;
  invoice: string;
  type: string;
};

export const columns: ColumnDef<Charge>[] = [
  {
    accessorKey: "refNumber",
    header: "#Ref-No",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.currency as string;
      return (
        <div className="flex flex-col items-center w-min">
          <span>{amount}</span>
          <span>{currency}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
