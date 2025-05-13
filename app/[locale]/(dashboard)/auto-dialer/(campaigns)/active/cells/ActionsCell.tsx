import { AutoDialerCampaignCols } from "../columns";
import {
  MoreVert as EllipsisVerticalIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Stop as SquareIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
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

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);

  const onStart = async () => {
    try {
      setIsStarting(true);
      console.log("Starting campaign...");
      const res = await autoDialerService.startCampaign(row.original.id);
      console.log("Campaign started successfully:", res);
    } catch (error) {
      console.error("Error starting campaign:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const onPause = async () => {
    try {
      setIsPausing(true);
      console.log("Pausing campaign...");
      const res = await autoDialerService.pauseCampaign(row.original.id);
      console.log("Campaign paused successfully:", res);
    } catch (error) {
      console.error("Error pausing campaign:", error);
    } finally {
      setIsPausing(false);
    }
  };

  const onResume = async () => {
    try {
      setIsResuming(true);
      console.log("Resuming campaign...");
      const res = await autoDialerService.resumeCampaign(row.original.id);
      console.log("Campaign resumed successfully:", res);
    } catch (error) {
      console.error("Error resuming campaign:", error);
    } finally {
      setIsResuming(false);
    }
  };

  const onFinish = async () => {
    try {
      setIsFinishing(true);
      console.log("Finishing campaign...");
      const res = await autoDialerService.finishCampaign(row.original.id);
      console.log("Campaign finished successfully:", res);
    } catch (error) {
      console.error("Error finishing campaign:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  const onDownloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      console.log("Downloading report...");
      const res = await autoDialerService.downloadReport(row.original.id);
      console.log("Report downloaded successfully:", res);
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setIsDownloadingReport(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {row.original.isDraft &&
        ["customers-inserted", "corrupted-ignored"].includes(
          row.original.status
        ) && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost-primary" size="icon" disabled={isStarting}>
                <div className="flex items-center">
                  {isStarting ? (
                    <HalfCircleSpinner className="animate-spin" />
                  ) : (
                    <PlayIcon />
                  )}
                </div>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will start the campaign.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onStart}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

      {["in-progress", "active"].includes(row.original.status) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost-warning" size="icon" disabled={isPausing}>
              <div className="flex items-center">
                {isPausing ? (
                  <HalfCircleSpinner className="animate-spin" />
                ) : (
                  <PauseIcon />
                )}
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will pause the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onPause}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {row.original.status === "paused" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost-primary" size="icon" disabled={isResuming}>
              <div className="flex items-center">
                {isResuming ? (
                  <HalfCircleSpinner className="animate-spin" />
                ) : (
                  <PlayIcon />
                )}
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will resume the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onResume}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {["in-progress", "active", "paused"].includes(row.original.status) && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost-destructive"
              size="icon"
              disabled={isFinishing}
            >
              <div className="flex items-center">
                {isFinishing ? (
                  <HalfCircleSpinner className="animate-spin" />
                ) : (
                  <SquareIcon />
                )}
              </div>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will finish the campaign.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onFinish}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

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

      {row.original.isDraft && (
        <Button size="icon">
          <EditIcon />
        </Button>
      )}

      <Button size="icon">
        <EyeIcon />
      </Button>

      <Button variant="unstyled" size="icon">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
  return (
    <div className="flex items-center gap-2">
      {row.original.status === "paused" ? (
        <Button variant="ghost-primary" size="icon">
          <PlayIcon />
        </Button>
      ) : (
        <Button variant="ghost-warning" size="icon">
          <PauseIcon />
        </Button>
      )}
      <Button variant="ghost-destructive" size="icon">
        <SquareIcon />
      </Button>
      <Button variant="unstyled" size="icon">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  );
};

export default ActionsCell;
