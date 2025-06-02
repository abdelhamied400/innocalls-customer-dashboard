"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ActionsCell from "./cells/ActionsCell";

// User type definition
export type User = {
  id: string;
  email: string;
  ext: string;
  name: string;
  status: string;
};

// Table columns definition
export const columns: import("@tanstack/react-table").ColumnDef<User, any>[] = [
  {
    accessorKey: "ext",
    enablePinning: true,
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <Badge
        variant={row.getValue("status") === "enabled" ? "success" : "muted"}
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ActionsCell,
  },
];
