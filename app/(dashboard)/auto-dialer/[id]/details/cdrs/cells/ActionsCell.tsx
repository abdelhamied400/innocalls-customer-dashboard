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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<CampaignCdrsCols, ReactNode>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const cdr = row.original;
  const t = useTranslations("autoDialer.campaignCdrs");
  if (!cdr.recordingLink) return null;

  return (
    <TooltipProvider>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost-success">
                <PlayCircle />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("listen")}</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent>
          <DialogTitle>{cdr.phone}</DialogTitle>
          <StreamingSoundPlayer label={cdr.name} url={cdr.recordingLink} />
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ActionsCell;
