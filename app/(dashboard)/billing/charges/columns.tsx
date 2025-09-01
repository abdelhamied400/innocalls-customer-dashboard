"use client";

import SortingHead from "@/components/SortingHead";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";

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

export const columns = (): ColumnDef<Charge>[] => {
  const t = useTranslations("billing.charges.columns");
  return [
    {
      accessorKey: "id",
      header: t("refNo"),
    },
    {
      accessorKey: "datetime",
      header: t("date"),
      cell: ({ row }) => (
        <div className="datetime-cell font-normal">
          <p>{row.original.datetime.date}</p>
          <p className="text-gray-500">{row.original.datetime.time}</p>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: t("amount"),
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
      header: t("description"),
    },
  ];
};
