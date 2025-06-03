"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Rate = {
  currency: string;
  destinationCode: string;
  destinationName: string;
  rate: string;
  sourceCode: string;
  sourceName: string;
};

export const columns: ColumnDef<Rate>[] = [
  {
    accessorKey: "sourceCode",
    header: "Source Code",
  },
  {
    accessorKey: "destinationName",
    header: "Destination Name",
  },
  {
    accessorKey: "destinationCode",
    header: "Destination Code",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      const rate = row.getValue("rate") as string;
      const currency = row.original.currency as string;
      return (
        <div className="flex flex-col items-center w-min font-normal">
          <p>{rate}</p>
          <p className="text-gray-500">{currency}</p>
        </div>
      );
    },
  },
];
