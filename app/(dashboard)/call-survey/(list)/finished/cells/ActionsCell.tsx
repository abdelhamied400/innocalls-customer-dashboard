"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { Visibility, List, BarChart } from "@mui/icons-material";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<CallSurvey>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callSurvey.finished");
  const survey = row.original;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* View details */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${survey.id}/details`}>
                <Visibility fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.view")}</TooltipContent>
        </Tooltip>

        {/* CDRs */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${survey.id}/details/cdrs`}>
                <List fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.cdrs")}</TooltipContent>
        </Tooltip>

        {/* Analytics */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${survey.id}/details/analytics`}>
                <BarChart fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.analytics")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
