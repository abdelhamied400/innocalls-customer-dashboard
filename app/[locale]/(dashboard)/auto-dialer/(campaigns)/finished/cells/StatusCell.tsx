import { Badge } from "@/components/ui/badge";
import { AutoDialerCampaignCols } from "../columns";
import {
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Warning as AlertTriangleIcon,
  Autorenew as Loader2Icon,
  CheckBox as CheckSquareIcon,
  ArrowForward as ArrowRightCircleIcon,
  Stop,
  Check,
  CancelRounded,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { cn } from "@/lib/utils";
import { AutoDialerCampaignFinishedStatus } from "@/constants/auto-dialer";

const classNames: Record<AutoDialerCampaignFinishedStatus, string> = {
  completed: "bg-success-200 hover:bg-success-200 text-success-500",
  cancelled: "bg-destructive-200 hover:bg-destructive-200 text-destructive-500",
  failed: "bg-warning-200 hover:bg-warning-200 text-warning-500",
  finished: "bg-gray-200 hover:bg-gray-200 text-gray-500",
};

type StatusCellProps = Cell<AutoDialerCampaignCols>;
const StatusCell = ({ cell }: StatusCellProps) => {
  const status = cell.getValue() as AutoDialerCampaignFinishedStatus;
  return (
    <Badge className={cn("font-bold", classNames[status])}>
      <span className="flex items-center gap-2">
        {status === "completed" && <Check />}
        {status === "cancelled" && <CancelRounded />}
        {status === "failed" && <XCircleIcon />}
        {status === "finished" && <Stop />}
        {cell.renderValue()}
      </span>
    </Badge>
  );
};

export default StatusCell;
