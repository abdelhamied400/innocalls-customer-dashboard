"use client";
import { CallBridge } from "@/types/callBridge";
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

type ActionsCellProps = Cell<CallBridge>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callBridge.list");
  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-bridge/${row.original.id}`}>
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
