"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const CompletedAtCell = ({ row }: CellContext<ScheduledReportHistoryItem, unknown>) => {
  const { completedAt } = row.original;

  if (!completedAt) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium">{completedAt.date}</span>
      <span className="text-sm text-muted-foreground">{completedAt.time}</span>
    </div>
  );
};

export default CompletedAtCell;
