"use client";

import SortingHead from "@/components/SortingHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MonitorUser = {
  dnd: string;
  ext: string;
  ip: string;
  name: string;
  on_call: boolean;
  status: string;
  ua: string;
};

export const columns = (
  t: ReturnType<typeof useTranslations>
): ColumnDef<MonitorUser>[] => [
  {
    accessorKey: "ext",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.extension")}</SortingHead>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <SortingHead column={column}>{t("columns.name")}</SortingHead>
    ),
  },
  {
    accessorKey: "ip",
    header: t("columns.ip"),
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("status") === "online" ? "success" : "muted"}
      >
        {t(`status.${row.getValue("status")}`)}
      </Badge>
    ),
  },
  {
    accessorKey: "on_call",
    header: t("columns.onCall"),
    cell: ({ row }) => (
      <div className="on-call flex items-center gap-2">
        <Badge
          variant={row.getValue("on_call") ? "default" : "muted"}
          className="capitalize"
        >
          {row.getValue("on_call") ? t("onCall.yes") : t("onCall.no")}
        </Badge>
        {!!row.getValue("on_call") && (
          <Button size="icon" variant="ghost">
            <Image
              src="/assets/icons/incognito.svg"
              alt="Incognito"
              width={24}
              height={24}
            />
          </Button>
        )}
      </div>
    ),
  },
];
