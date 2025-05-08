import { Badge } from "@/components/ui/badge";
import { AutoDialerCampaignCols } from "../columns";
import {
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Warning as AlertTriangleIcon,
  Autorenew as Loader2Icon,
  Delete as Trash2Icon,
  CheckBox as CheckSquareIcon,
  ArrowForward as ArrowRightCircleIcon,
  ArrowUpward as ArrowUpCircleIcon,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { cn } from "@/lib/utils";

const classNames = {
  created: "bg-green-100 text-green-600 hover:bg-green-200",
  "schedule-customers": "bg-blue-100 text-blue-600 hover:bg-blue-200",
  "verifying-customers": "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
  "verification-failed": "bg-red-100 text-red-600 hover:bg-red-200",
  cancelled: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  "corrupted-ignored": "bg-purple-100 text-purple-600 hover:bg-purple-200",
  "customers-inserted": "bg-orange-100 text-orange-600 hover:bg-orange-200",
  "in-progress": "bg-teal-100 text-teal-600 hover:bg-teal-200",
  active: "bg-pink-100 text-pink-600 hover:bg-pink-200",
  paused: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
  finished: "bg-lime-100 text-lime-600 hover:bg-lime-200",
  completed: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200",
};

type StatusCellProps = Cell<AutoDialerCampaignCols>;
const StatusCell = ({ cell }: StatusCellProps) => {
  const status = cell.getValue() as keyof typeof classNames;
  return (
    <Badge className={cn(classNames[status])}>
      <span className="flex items-center gap-2">
        {status === "created" && <CheckCircleIcon />}
        {status === "schedule-customers" && <ArrowRightCircleIcon />}
        {status === "verifying-customers" && (
          <ArrowRightCircleIcon className="animate-pulse" />
        )}
        {status === "verification-failed" && (
          <XCircleIcon className="text-red-600 animate-pulse" />
        )}
        {status === "cancelled" && (
          <Trash2Icon className="text-gray-600 animate-pulse" />
        )}
        {status === "corrupted-ignored" && (
          <AlertTriangleIcon className="text-purple-600 animate-pulse" />
        )}
        {status === "customers-inserted" && (
          <CheckSquareIcon className="text-orange-600 animate-pulse" />
        )}
        {status === "in-progress" && (
          <div className="w-4 h-4 flex items-center justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        )}
        {status === "active" && (
          <PlayIcon className="text-pink-600 animate-pulse" />
        )}
        {status === "paused" && (
          <PauseIcon className="text-indigo-600 animate-pulse" />
        )}
        {status === "finished" && (
          <ArrowUpCircleIcon className="text-lime-600 animate-pulse" />
        )}
        {status === "completed" && (
          <CheckCircleIcon className="text-emerald-600 animate-pulse" />
        )}

        {cell.renderValue()}
      </span>
    </Badge>
  );
};

export default StatusCell;
