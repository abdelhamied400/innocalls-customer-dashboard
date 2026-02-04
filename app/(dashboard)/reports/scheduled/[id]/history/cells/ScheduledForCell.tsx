"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const ScheduledForCell = ({ row }: CellContext<ScheduledReportHistoryItem, unknown>) => {
  const { scheduledFor } = row.original;

  return (
    <div className="flex flex-col">
      <span className="font-medium">{scheduledFor.date}</span>
      <span className="text-sm text-muted-foreground">{scheduledFor.time}</span>
    </div>
  );
};

export default ScheduledForCell;
