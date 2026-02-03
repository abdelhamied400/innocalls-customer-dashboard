"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";

const ScheduledCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const frequency = row.original.frequency;
  const t = useTranslations("reports.scheduled.cells.scheduled");

  const classMap: Record<string, string> = {
    daily: "bg-info-200 text-info-500",
    weekly: "bg-[#DFD6F1] text-[#44157D]",
    monthly: "bg-[#D7EEF7] text-[#2021AD]",
  };

  return (
    <Badge className={cn("rounded-lg border-0", classMap[frequency])}>
      {t(frequency)}
    </Badge>
  );
};

export default ScheduledCell;
