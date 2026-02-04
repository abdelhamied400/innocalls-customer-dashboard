"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReportHistoryItem } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const StatusCell = ({ row }: CellContext<ScheduledReportHistoryItem, unknown>) => {
  const status = row.original.status;
  const t = useTranslations("reports.scheduled.history.cells.status");

  const variantMap: Record<string, "success" | "destructive" | "secondary" | "muted"> = {
    completed: "success",
    failed: "destructive",
    pending: "secondary",
    processing: "muted",
  };

  return (
    <Badge variant={variantMap[status] || "secondary"}>
      {t(status)}
    </Badge>
  );
};

export default StatusCell;
