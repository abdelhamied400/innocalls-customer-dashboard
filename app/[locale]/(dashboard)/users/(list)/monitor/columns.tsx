"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Extension No.
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }: { column: any }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
