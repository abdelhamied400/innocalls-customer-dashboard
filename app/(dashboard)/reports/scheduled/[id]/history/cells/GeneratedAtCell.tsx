"use client";

import { ScheduledReportHistoryItem } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const GeneratedAtCell = ({
  row,
}: CellContext<ScheduledReportHistoryItem, unknown>) => {
  const { generatedAt } = row.original;

  return (
    <div className="flex flex-col">
      <span className="font-medium">{generatedAt.date}</span>
      <span className="text-sm text-muted-foreground">{generatedAt.time}</span>
    </div>
  );
};

export default GeneratedAtCell;
