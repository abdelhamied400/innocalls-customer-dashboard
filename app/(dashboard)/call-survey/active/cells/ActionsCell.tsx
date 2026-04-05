"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { Visibility } from "@mui/icons-material";
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
  const t = useTranslations("callSurvey.active");
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${row.original.id}`}>
                <Visibility fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.view")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ActionsCell;
