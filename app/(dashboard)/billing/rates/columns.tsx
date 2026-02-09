"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";

export type Rate = {
  currency: string;
  destinationCode: string;
  destinationName: string;
  rate: string;
  sourceCode: string;
  sourceName: string;
};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<Rate>[] => [
  {
    accessorKey: "sourceCode",
    header: t("columns.sourceCode"),
  },
  {
    accessorKey: "destinationName",
    header: t("columns.destinationName"),
  },
  {
    accessorKey: "destinationCode",
    header: t("columns.destinationCode"),
  },
  {
    accessorKey: "rate",
    header: t("columns.rate"),
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
