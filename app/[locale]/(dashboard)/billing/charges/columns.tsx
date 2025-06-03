"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type Charge = {
  amount: number;
  currency: string;
  datetime: {
    date: string;
    time: string;
  };
  description: string;
  gateway: string | null;
  invoice: string;
  type: string;
};

export const columns: ColumnDef<Charge>[] = [
  {
    accessorKey: "id",
    header: "#Ref-No",
  },
  {
    accessorKey: "datetime",
    header: "Date",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.datetime.date}</p>
        <p className="text-gray-500">{row.original.datetime.time}</p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      const currency = row.original.currency as string;
      return (
        <div className="flex flex-col items-center w-min font-normal">
          <p>{amount}</p>
          <p className="text-gray-500">{currency}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
