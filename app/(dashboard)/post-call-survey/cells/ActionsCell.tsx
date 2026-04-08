"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cell } from "@/types/cell";
import { PostCallSurvey } from "@/types/api/post-call-survey";
import {
  MoreVert,
  Visibility,
  FileDownload,
  BarChart,
  PhoneInTalk,
} from "@mui/icons-material";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useTranslations } from "@/providers/TranslationProvider";
import postCallSurveyService from "@/services/post-call-survey.service";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionsCellProps = Cell<PostCallSurvey>;

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const t = useTranslations("postCallSurvey");

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      await postCallSurveyService.exportReport(row.original.id);
      toast.success(t("messages.exportSuccess"));
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.exportFailed"), {
          description:
            error.response?.data?.message || t("messages.unexpectedError"),
        });
      } else {
        toast.error(t("messages.exportFailed"), {
          description:
            error instanceof Error
              ? error.message
              : t("messages.unexpectedError"),
        });
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost-info"
              size="icon"
              disabled={isExporting}
              loading={isExporting}
              onClick={handleExportReport}
            >
              <FileDownload />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.exportReport")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-success" size="icon" asChild>
              <Link href={`/post-call-survey/${row.original.id}/details`}>
                <Visibility />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.viewDetails")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVert />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={`/post-call-survey/${row.original.id}/cdrs`}>
            <DropdownMenuItem>
              <PhoneInTalk />
              {t("actions.cdrs")}
            </DropdownMenuItem>
          </Link>
          <Link href={`/post-call-survey/${row.original.id}/call-analytics`}>
            <DropdownMenuItem>
              <BarChart />
              {t("actions.callAnalytics")}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
