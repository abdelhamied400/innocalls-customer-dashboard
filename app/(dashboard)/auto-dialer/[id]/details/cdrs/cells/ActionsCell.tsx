import { Cell } from "@/types/cell";
import { CampaignCdrsCols } from "../columns";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";

type ActionsCellProps = Cell<CampaignCdrsCols, ReactNode>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const cdr = row.original;
  if (!cdr.recordingLink) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost-success">
          <PlayCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{cdr.phone}</DialogTitle>
        <StreamingSoundPlayer label={cdr.name} url={cdr.recordingLink} />
      </DialogContent>
    </Dialog>
  );
};

export default ActionsCell;
