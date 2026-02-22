import { Cell } from "@/types/cell";
import { AgentCampaignCdrCols } from "../columns";
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
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<AgentCampaignCdrCols, ReactNode>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const cdr = row.original;
  const t = useTranslations("autoDialerAgent");

  if (!cdr.recordingLink) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost-success">
          <PlayCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{t("listen")}</DialogTitle>
        <StreamingSoundPlayer label={cdr.name} url={cdr.recordingLink} />
      </DialogContent>
    </Dialog>
  );
};

export default ActionsCell;
