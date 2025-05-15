import { AutoDialerCampaignCols } from "../columns";
import {
  MoreVert as EllipsisVerticalIcon,
  Download as DownloadIcon,
  Visibility as EyeIcon,
  Autorenew as HalfCircleSpinner,
} from "@mui/icons-material";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import autoDialerService from "@/services/auto-dialer.service";
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
import { useToast } from "@/hooks/use-toast";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const { toast } = useToast();

  const onDownloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      await autoDialerService.downloadReport(row.original.id);
      toast({
        title: "Report will be sent to your email",
        description:
          "The report is being processed and will be sent to your email shortly.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {["finished", "completed"].includes(row.original.status) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" disabled={isDownloadingReport}>
              <div className="flex items-center">
                {isDownloadingReport ? (
                  <HalfCircleSpinner className="animate-spin" />
                ) : (
                  <DownloadIcon />
                )}
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will download the report for the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDownloadReport}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Button size="icon">
        <EyeIcon />
      </Button>

      <Button variant="unstyled" size="icon">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
};

export default ActionsCell;
