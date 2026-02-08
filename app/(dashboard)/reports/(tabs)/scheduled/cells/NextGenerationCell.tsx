import { ScheduledReport } from "@/types/api/report";
import { useLocale } from "@/providers/TranslationProvider";
import { CellContext } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { arEG, enUS } from "date-fns/locale";

const NextGenerationCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const { formattedNextGenerationDate, time } = row.original;

  return (
    <div className="flex flex-col font-normal">
      <span>{formattedNextGenerationDate}</span>
      <span className="text-muted-foreground text-sm">{time}</span>
    </div>
  );
};

export default NextGenerationCell;
