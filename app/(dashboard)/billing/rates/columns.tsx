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

export const columns = (): ColumnDef<Rate>[] => {
  const t = useTranslations("billing.rates.columns");

  return [
    {
      accessorKey: "sourceCode",
      header: t("sourceCode"),
    },
    {
      accessorKey: "destinationName",
      header: t("destinationName"),
    },
    {
      accessorKey: "destinationCode",
      header: t("destinationCode"),
    },
    {
      accessorKey: "rate",
      header: t("rate"),
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
};
