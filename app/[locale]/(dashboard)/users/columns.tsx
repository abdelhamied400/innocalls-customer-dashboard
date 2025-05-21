"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Block, Cached, MoreVert, Refresh } from "@mui/icons-material";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  email: string;
  ext: string;
  name: string;
  status: string;
};

export const columns: ColumnDef<Number>[] = [
  {
    accessorKey: "ext",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Extension No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
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
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.getValue("status") === "enabled" ? (
          <Button variant="ghost-destructive" size="icon">
            <Block />
          </Button>
        ) : (
          <Button variant="ghost-success" size="icon">
            <Cached />
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <MoreVert />
        </Button>
      </div>
    ),
  },
];
