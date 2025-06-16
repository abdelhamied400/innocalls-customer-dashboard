"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type PaymentHistory = {
  amount: number;
  currency: string;
  description: string;
  gateway: string | null;
  invoice: string;
  type: string;
  datetime: {
    date: string;
    time: string;
  };
};

export const columns = (): ColumnDef<PaymentHistory>[] => {
  const t = useTranslations("billing.paymentHistory.columns");

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
