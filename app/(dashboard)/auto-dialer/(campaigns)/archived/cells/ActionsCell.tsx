import { AutoDialerCampaignCols } from "../columns";
import {
  MoreVert as EllipsisVerticalIcon,
  Visibility as EyeIcon,
  Download,
  Archive,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import autoDialerService from "@/services/auto-dialer.service";
import Link from "next/link";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

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

  // const archiveCampaign = async () => {
  //   try {
  //     setIsArchiving(true);
  //     await autoDialerService.archiveCampaign(row.original.id);
  //     await queryClient.invalidateQueries({
  //       queryKey: ["auto-dialer-finished-campaigns"],
  //     });
  //     await queryClient.invalidateQueries({
  //       queryKey: ["auto-dialer-archived-campaigns"],
  //     });
  //     toast({
  //       title: "Campaign Archived",
  //       description: "The campaign has been successfully archived.",
  //       variant: "success",
  //     });
  //   } catch (error) {
  //     if (isAxiosError(error)) {
  //       toast({
  //         title: "Error",
  //         description: error.response?.data?.message || "An error occurred",
  //         variant: "destructive",
  //       });
  //       return;
  //     }
  //     toast({
  //       title: "Error",
  //       description: "An error occurred while archiving the campaign.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsArchiving(false);
  //   }
  // };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost-success"
        size="icon"
        onClick={downloadReport}
        loading={isDownloading}
        disabled={isDownloading}
      >
        <Download />
      </Button>
      <Link href={`/auto-dialer/campaigns/${row.original.id}/edit`}>
        <Button variant="ghost-primary" size="icon">
          <EyeIcon />
        </Button>
      </Link>

      {/* <AlertDialog>
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
      </AlertDialog> */}
    </div>
  );
};

export default ActionsCell;
