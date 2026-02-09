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

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const queryClient = useQueryClient();

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      await autoDialerService.downloadReport(row.original.id);
      toast.success("Download started", {
        description: "Your report is being Processed. You will receive an email with the download link once it's ready.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Error", {
        description: "An error occurred while downloading the report.",
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
      toast.success("Campaign Archived", {
        description: "The campaign has been successfully archived.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Error", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Error", {
        description: "An error occurred while archiving the campaign.",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <TooltipProvider>
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
            <p>Download &quot;{row.original.name}&quot; campaign results report</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Link href={`/auto-dialer/campaigns/${row.original.id}/edit`}>
        <Button variant="ghost-primary" size="icon">
          <EyeIcon />
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  loading={isArchiving}
                  disabled={isArchiving}
                >
                  <Archive />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive &quot;{row.original.name}&quot; campaign</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will archive the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={archiveCampaign}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsCell;
