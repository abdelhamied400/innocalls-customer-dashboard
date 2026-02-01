"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const ScheduledCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const scheduled = row.original.scheduled;
  const t = useTranslations("reports.scheduled.cells.scheduled");

  const classMap: Record<string, string> = {
    daily: "bg-info-200 text-info-500",
    weekly: "bg-[#DFD6F1] text-[#44157D]",
    monthly: "bg-[#D7EEF7] text-[#2021AD]",
  };

  return (
    <Badge className={cn("rounded-lg border-0", classMap[scheduled])}>
      {t(scheduled)}
    </Badge>
  );
};

export default ScheduledCell;
