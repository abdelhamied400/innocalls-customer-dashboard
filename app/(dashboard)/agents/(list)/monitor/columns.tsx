"use client";

import SortingHead from "@/components/SortingHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row, RowData, Table } from "@tanstack/react-table";
import { useTranslations } from "@/providers/TranslationProvider";
import Image from "next/image";
import { Tooltip } from "@mui/material";
import useWebrtcStore from "@/store/webrtc.slice";

// Extend TableMeta to include onSpy
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onSpy?: (ext: string) => void;
  }
}

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

const OnCallCell = ({
  row,
  table,
  t,
}: {
  row: Row<MonitorUser>;
  table: Table<MonitorUser>;
  t: ReturnType<typeof useTranslations>;
}) => {
  const { extension } = useWebrtcStore();
  return (
    <div className="on-call flex items-center gap-2">
      <Badge
        variant={row.getValue("on_call") ? "default" : "muted"}
        className="capitalize"
      >
        {row.getValue("on_call") ? t("onCall.yes") : t("onCall.no")}
      </Badge>
      {!!row.getValue("on_call") && extension?.ext !== row.original.ext && (
        <Tooltip title={t("tooltips.spy")} arrow>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.options.meta?.onSpy?.(row.original.ext)}
          >
            <Image
              src="/assets/icons/incognito.svg"
              alt="spy"
              width={24}
              height={24}
            />
          </Button>
        </Tooltip>
      )}
    </div>
  );
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
    cell: ({ row, table }) => (
      <OnCallCell row={row} table={table} t={t} />
    ),
  },
];
