import { AutoDialerCampaignCols } from "../columns";
import {
  MoreVert as EllipsisVerticalIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Stop as SquareIcon,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  return (
    <div className="flex items-center gap-2">
      {row.original.status === "paused" ? (
        <Button variant="ghost-primary" size="icon">
          <PlayIcon />
        </Button>
      ) : (
        <Button variant="ghost-warning" size="icon">
          <PauseIcon />
        </Button>
      )}
      <Button variant="ghost-destructive" size="icon">
        <SquareIcon />
      </Button>
      <Button variant="unstyled" size="icon">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
};

export default ActionsCell;
