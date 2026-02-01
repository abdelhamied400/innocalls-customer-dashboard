import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { format } from "date-fns";

const NextGenerationCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const date = new Date(row.original.nextGeneration);

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
