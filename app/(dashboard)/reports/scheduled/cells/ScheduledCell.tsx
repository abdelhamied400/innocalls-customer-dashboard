"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const ScheduledCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const scheduled = row.original.scheduled;
  const t = useTranslations("reports.scheduled.cells.scheduled");

  const variantMap: Record<string, "default" | "secondary" | "warning"> = {
    daily: "default",
    weekly: "secondary",
    monthly: "warning",
  };

  return (
    <Badge variant={variantMap[scheduled] || "secondary"}>
      {t(scheduled)}
    </Badge>
  );
};

export default ScheduledCell;
