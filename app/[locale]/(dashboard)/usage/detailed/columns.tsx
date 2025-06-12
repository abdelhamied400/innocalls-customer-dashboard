"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export type UsageDetailed = {};

const generateHeaderFromKey = (key: string) => {
  return key
    .split(/(?=[A-Z])/) // Split on uppercase letters
    .join(" ") // Join with space
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};

export const createColumns = (columnKeys: string[]) => {
  const predefinedColumns: Record<string, ColumnDef<UsageDetailed>> = {
    origin: {
      accessorKey: "origin",
      header: "Origin",
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
            <Badge variant={variant}>{origin}</Badge>
          </div>
        );
      },
    },
  };

  return columnKeys.map((key) => {
    if (predefinedColumns[key]) {
      return predefinedColumns[key];
    }
    return {
      accessorKey: key,
      header: generateHeaderFromKey(key),
      cell: ({ row }: any) => row.getValue(key),
    };
  });
};
