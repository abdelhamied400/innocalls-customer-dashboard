"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";

export type UsageDetailed = {};

const generateHeaderFromKey = (key: string) => {
  return key
    .split(/(?=[A-Z])/) // Split on uppercase letters
    .join(" ") // Join with space
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};

export const createColumns = (columnKeys: string[]) => {
  const t = useTranslations("usage.detailed.columns");
  const tOrigin = useTranslations("usage.detailed.origin");

  const predefinedColumns: Record<string, ColumnDef<UsageDetailed>> = {
    origin: {
      accessorKey: "origin",
      header: t("origin"),
      cell: ({ row }) => {
        const origin = row.getValue("origin") as string;
        const variantsLookup: any = {
          Incoming: "default",
          Outgoing: "success",
          Internal: "muted",
        };
        const variant = variantsLookup[origin] || "muted";
        return (
          <div className="flex items-center">
            <Badge variant={variant}>
              {tOrigin(`${origin?.toLocaleLowerCase()}`)}
            </Badge>
          </div>
        );
      },
    },
  };

  return columnKeys.map((key) => {
    if (predefinedColumns[key]) {
      return predefinedColumns[key];
    }

    // Fallback to translated column name or generate from key
    const translatedHeader = t(key as any) || generateHeaderFromKey(key);

    return {
      accessorKey: key,
      header: translatedHeader,
      cell: ({ row }: any) => {
        const value = row.getValue(key);
        if (
          key.toLowerCase().includes("srcpartyid") ||
          key.toLowerCase().includes("dstpartyid")
        ) {
          return "\u200E" + value; // add Left-to-Right Mark
        }
        return value;
      },
    };
  });
};
