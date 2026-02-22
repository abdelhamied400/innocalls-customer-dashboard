import { AutoDialerCampaignCols } from "../columns";
import { Visibility as EyeIcon, Download, Archive } from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import autoDialerService from "@/services/auto-dialer.service";
import Link from "next/link";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("autoDialer.finishedCampaigns.actions");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const queryClient = useQueryClient();

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      await autoDialerService.downloadReport(row.original.id);
      toast.success(t("toasts.downloadSuccess"), {
        description: t("toasts.downloadSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description: error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const archiveCampaign = async () => {
    try {
      setIsArchiving(true);
      await autoDialerService.archiveCampaign(row.original.id);
      await queryClient.invalidateQueries({
        queryKey: ["auto-dialer-finished-campaigns"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["auto-dialer-archived-campaigns"],
      });
      toast.success(t("toasts.archiveSuccess"), {
        description: t("toasts.archiveSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description: error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsArchiving(false);
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

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  loading={isArchiving}
                  disabled={isArchiving}
                >
                  <Archive />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("archive")}</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("archiveModal.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("archiveModal.message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("archiveModal.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={archiveCampaign}>
                {t("archiveModal.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
