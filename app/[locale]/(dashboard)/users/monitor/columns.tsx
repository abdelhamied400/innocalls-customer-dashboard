"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type MonitorUser = {
  dnd: string;
  ext: string;
  ip: string;
  name: string;
  on_call: true | "";
  status: string;
  ua: string;
};

export const columns: ColumnDef<MonitorUser>[] = [
  {
    accessorKey: "ext",
    header: "Extension No.",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "ip",
    header: "IP",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("status") === "online" ? "success" : "muted"}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "on_call",
    header: "On Call",
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("on_call") ? "default" : "muted"}
        className="capitalize"
      >
        {row.getValue("on_call") ? "yes" : "no"}
      </Badge>
    ),
  },
];
