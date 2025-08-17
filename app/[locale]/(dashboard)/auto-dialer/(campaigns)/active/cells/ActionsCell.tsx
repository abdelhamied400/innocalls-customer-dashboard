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
import { useToast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const refetchCampaigns = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["auto-dialer-active-campaigns"],
    });
  };

  const onStart = async () => {
    try {
      setIsStarting(true);
      await autoDialerService.startCampaign(row.original.id);
      refetchCampaigns();
      toast({
        title: "Campaign started",
        description: "The campaign has been successfully started.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Campaign start failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Campaign start failed",
        description: "An error occurred while starting the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const onPause = async () => {
    try {
      setIsPausing(true);
      await autoDialerService.pauseCampaign(row.original.id);
      refetchCampaigns();
      toast({
        title: "Campaign paused",
        description: "The campaign has been successfully paused.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Campaign pause failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Campaign pause failed",
        description: "An error occurred while pausing the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsPausing(false);
    }
  };

  const onResume = async () => {
    try {
      setIsResuming(true);
      await autoDialerService.resumeCampaign(row.original.id);
      refetchCampaigns();
      toast({
        title: "Campaign resumed",
        description: "The campaign has been successfully resumed.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Campaign resume failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Campaign resume failed",
        description: "An error occurred while resuming the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsResuming(false);
    }
  };

  const onFinish = async () => {
    try {
      setIsFinishing(true);
      await autoDialerService.finishCampaign(row.original.id);
      refetchCampaigns();
      toast({
        title: "Campaign finished",
        description: "The campaign has been successfully finished.",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Campaign finish failed",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Campaign finish failed",
        description: "An error occurred while finishing the campaign.",
        variant: "destructive",
      });
    } finally {
      setIsFinishing(false);
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
};

export default ActionsCell;
