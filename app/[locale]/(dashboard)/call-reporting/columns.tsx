"use client";

import { Badge } from "@/components/ui/badge";
import { Call } from "@/types/api/call-reporting";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.to.name}</p>
        <p className="text-gray-500">{row.original.to.number}</p>
      </div>
    ),
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.from.name}</p>
        <p className="text-gray-500">{row.original.from.number}</p>
      </div>
    ),
  },
  {
    accessorKey: "datetime",
    header: "Call Date",
    cell: ({ row }) => (
      <div className="datetime-cell font-normal">
        <p>{row.original.datetime.date}</p>
        <p className="text-gray-500">{row.original.datetime.time}</p>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Call Duration",
  },
  {
    accessorKey: "call_status",
    header: "Call Status",
    cell: ({ row }) => {
      const status = row.getValue("call_status") as string;

      if (status === "Answered") {
        return (
          <Badge variant="success" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Busy") {
        return (
          <Badge variant="warning" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Failed") {
        return (
          <Badge variant="destructive" className="capitalize">
            {status}
          </Badge>
        );
      }
      if (status === "Not Answered") {
        return (
          <Badge variant="muted" className="capitalize">
            {status}
          </Badge>
        );
      }
      return (
        <Badge variant="default" className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "direction",
    header: "Call Direction",
    cell: ({ row }) => (
      <Badge
        variant={row.getValue("direction") === "outgoing" ? "success" : "muted"}
        className="capitalize"
      >
        {row.getValue("direction")}
      </Badge>
    ),
  },
];
