"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const StatusCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const status = row.original.status;
  const t = useTranslations("reports.scheduled.cells.status");

  const variantMap: Record<string, "success" | "muted"> = {
    active: "success",
    inactive: "muted",
  };

  return (
    <Badge variant={variantMap[status] || "secondary"}>
      {t(status)}
    </Badge>
  );
};

export default StatusCell;
