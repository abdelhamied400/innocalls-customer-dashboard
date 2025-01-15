import { Badge } from "@/components/ui/badge";
import { AutoDialerCampaignCols } from "../columns";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Cell } from "@/types/cell";

type StatusCellProps = Cell<AutoDialerCampaignCols>;
const StatusCell = ({ cell }: StatusCellProps) => {
  return (
    <Badge variant={cell.getValue() === "paused" ? "warning" : "default"}>
      <span className="flex items-center gap-2">
        {cell.getValue() === "paused" && <PauseIcon size={16} />}
        {cell.getValue() === "played" && <PlayIcon size={16} />}
        {cell.renderValue()}
      </span>
    </Badge>
  );
};

export default StatusCell;
