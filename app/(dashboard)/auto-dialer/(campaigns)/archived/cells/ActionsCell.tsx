import { AutoDialerCampaignCols } from "../columns";
import { Visibility as EyeIcon, Download } from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import autoDialerService from "@/services/auto-dialer.service";
import Link from "next/link";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("autoDialer.archivedCampaigns.actions");
  const tt = useTranslations("autoDialer.archivedCampaigns.toasts");
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      await autoDialerService.downloadReport(row.original.id);
      toast.success(t("download"), {
        description: t("download"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(tt("error"), {
          description: error.response?.data?.message || tt("errorDescription"),
        });
        return;
      }
      toast.error(tt("error"), {
        description: tt("errorDescription"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost-success"
              size="icon"
              onClick={downloadReport}
              loading={isDownloading}
              disabled={isDownloading}
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("download")}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/auto-dialer/${row.original.id}/details`}>
              <Button variant="ghost-primary" size="icon">
                <EyeIcon />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("view")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
