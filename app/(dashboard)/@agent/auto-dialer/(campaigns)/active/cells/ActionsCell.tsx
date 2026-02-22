import { Cell } from "@/types/cell";
import { AgentCampaignCols } from "../columns";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Headset } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionsCellProps = Cell<AgentCampaignCols, ReactNode>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const campaign = row.original;
  const t = useTranslations("autoDialerAgent");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/auto-dialer/${campaign.id}/cdrs`}>
            <Button size="sm" variant="ghost-primary">
              <Headset className="mr-1" />
              {t("actions.cdrs")}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("tooltips.viewCdrs")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionsCell;
