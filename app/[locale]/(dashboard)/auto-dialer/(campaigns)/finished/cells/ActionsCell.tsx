import { AutoDialerCampaignCols } from "../columns";
import {
  EllipsisVerticalIcon,
  PauseIcon,
  PlayIcon,
  SquareIcon,
} from "lucide-react";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  return (
    <div className="flex items-center gap-2">
      {row.original.status === "paused" ? (
        <Button variant="ghost-primary" size="icon">
          <PlayIcon size={16} />
        </Button>
      ) : (
        <Button variant="ghost-warning" size="icon">
          <PauseIcon size={16} />
        </Button>
      )}
      <Button variant="ghost-destructive" size="icon">
        <SquareIcon size={16} />
      </Button>
      <Button variant="unstyled" size="icon">
        <EllipsisVerticalIcon size={16} />
      </Button>
    </div>
  );
};

export default ActionsCell;
