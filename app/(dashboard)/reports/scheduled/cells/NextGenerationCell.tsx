import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { format, parse } from "date-fns";

const NextGenerationCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const nextGenerationAtLocal = row.original.nextGenerationAtLocal;

  if (!nextGenerationAtLocal) {
    return <span className="text-muted-foreground">-</span>;
  }

  // Parse the local date string format: "2026-02-02 18:00:00"
  const date = parse(nextGenerationAtLocal, "yyyy-MM-dd HH:mm:ss", new Date());

  return (
    <div className="flex flex-col font-normal">
      <span>{format(date, "d MMM yyyy")}</span>
      <span className="text-muted-foreground text-sm">
        {format(date, "hh:mm a")}
      </span>
    </div>
  );
};

export default NextGenerationCell;
