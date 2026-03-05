import { Badge } from "@/components/ui/badge";
import { Cell } from "@/types/cell";
import { AgentCampaignCols } from "../columns";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/providers/TranslationProvider";

const classNames: Record<string, string> = {
  active: "bg-green-200 text-green-600 hover:bg-green-200",
  paused: "bg-warning-200 text-warning-500 hover:bg-warning-200",
  "in-progress": "bg-teal-200 text-teal-600 hover:bg-teal-200",
  created: "bg-blue-200 text-blue-600 hover:bg-blue-200",
  finished: "bg-gray-200 text-gray-600 hover:bg-gray-200",
  completed: "bg-success-200 text-success-500 hover:bg-success-200",
  started: "bg-cyan-200 text-cyan-600 hover:bg-cyan-200",
};

type StatusCellProps = Cell<AgentCampaignCols, ReactNode>;
const StatusCell = ({ cell }: StatusCellProps) => {
  const status = cell.getValue() as string;
  const t = useTranslations("autoDialerAgent");
  return (
    <Badge
      className={cn(
        "border-0",
        classNames[status] || "bg-gray-200 text-gray-600 hover:bg-gray-200",
      )}
    >
      <span className="flex items-center gap-2">{t(`statuses.${status}`)}</span>
    </Badge>
  );
};

export default StatusCell;
