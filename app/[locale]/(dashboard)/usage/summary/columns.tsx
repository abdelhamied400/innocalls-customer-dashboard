"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type UsageSummary = {};

const generateHeaderFromKey = (key: string) => {
  return key
    .split(/(?=[A-Z])/) // Split on uppercase letters
    .join(" ") // Join with space
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};

export const createColumns = (columnKeys: string[]) => {
  const t = useTranslations("usage.summary.columns");

  const predefinedColumns: Record<string, ColumnDef<UsageSummary>> = {
    serviceName: {
      accessorKey: "serviceName",
      header: t("servicesName"),

      cell: ({ row }) => {
        const serviceName = row.getValue("serviceName") as string;
        return (
          <div className="flex items-center">
            <Badge className="capitalize">{serviceName}</Badge>
          </div>
        );
      },
    },
  };


  return columnKeys.map((key) => {
    if (predefinedColumns[key]) {
      return predefinedColumns[key];
    }

    const translatedHeader = t(key as any) || generateHeaderFromKey(key);

    return {
      accessorKey: key,
      header: translatedHeader,
      cell: ({ row }: any) => row.getValue(key),
    };
  });
};
