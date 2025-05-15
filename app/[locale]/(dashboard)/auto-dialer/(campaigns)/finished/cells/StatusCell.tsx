import { Badge } from "@/components/ui/badge";
import { AutoDialerCampaignCols } from "../columns";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  CheckBox as CheckSquareIcon,
  Clear,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { cn } from "@/lib/utils";
import { AutoDialerCampaignInactiveStatus } from "@/constants/auto-dialer";

const classNames: Record<AutoDialerCampaignInactiveStatus, string> = {
  cancelled: "bg-orange-100 text-orange-600 hover:bg-orange-200",
  failed: "bg-red-100 text-red-600 hover:bg-red-200",
  finished: "bg-green-100 text-green-600 hover:bg-green-200",
  completed: "bg-blue-100 text-blue-600 hover:bg-blue-200",
};

type StatusCellProps = Cell<AutoDialerCampaignCols>;
const StatusCell = ({ cell }: StatusCellProps) => {
  const status = cell.getValue() as AutoDialerCampaignInactiveStatus;
  return (
    <Badge className={cn(classNames[status])}>
      <span className="flex items-center gap-2">
        {status === "cancelled" && (
          <Clear className="text-orange-600 animate-pulse" />
        )}
        {status === "failed" && (
          <XCircleIcon className="text-red-600 animate-pulse" />
        )}
        {status === "finished" && <CheckCircleIcon />}
        {status === "completed" && (
          <CheckSquareIcon className="text-sky-600 animate-pulse" />
        )}
        {cell.renderValue()}
      </span>
    </Badge>
  );
};

export default StatusCell;
