import { useDateFnsLocale } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { parse, format } from "date-fns";

const NextGenerationCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const { formattedNextGenerationDate, time, status } = row.original;
  const locale = useDateFnsLocale();
  // Parse the time (using today’s date as base)
  const parsed = parse(time, "HH:mm", new Date());

  // Format to 12-hour time
  const time12 = format(parsed, "h:mm a", {
    locale,
  });

  if (status === "inactive") {
    return null;
  }

  return (
    <div className="flex flex-col font-normal">
      <span>{formattedNextGenerationDate}</span>
      <span className="text-muted-foreground text-sm">{time12}</span>
    </div>
  );
};

export default NextGenerationCell;
