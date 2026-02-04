import { ScheduledReport } from "@/types/api/report";
import { CellContext } from "@tanstack/react-table";
import { format, parse } from "date-fns";

const NextGenerationCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const { nextGenerationDate, time, status } = row.original;

  if (status === "inactive") {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex flex-col font-normal">
      <span>{nextGenerationDate}</span>
      <span className="text-muted-foreground text-sm">{time}</span>
    </div>
  );
};

export default NextGenerationCell;
