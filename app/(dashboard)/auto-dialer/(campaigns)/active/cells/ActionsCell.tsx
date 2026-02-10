import { AutoDialerCampaignCols } from "../columns";
import {
  MoreVert as EllipsisVerticalIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  Stop as SquareIcon,
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
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const queryClient = useQueryClient();

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
      toast.success("Campaign started", {
        description: "The campaign has been successfully started.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Campaign start failed", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Campaign start failed", {
        description: "An error occurred while starting the campaign.",
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
      toast.success("Campaign paused", {
        description: "The campaign has been successfully paused.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Campaign pause failed", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Campaign pause failed", {
        description: "An error occurred while pausing the campaign.",
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
      toast.success("Campaign resumed", {
        description: "The campaign has been successfully resumed.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Campaign resume failed", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Campaign resume failed", {
        description: "An error occurred while resuming the campaign.",
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
      toast.success("Campaign finished", {
        description: "The campaign has been successfully finished.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error("Campaign finish failed", {
          description: error.response?.data?.message || "An error occurred",
        });
        return;
      }
      toast.error("Campaign finish failed", {
        description: "An error occurred while finishing the campaign.",
      });
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {row.original.isDraft &&
        ["customers-inserted", "corrupted-ignored"].includes(
          row.original.status,
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="unstyled" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <EyeIcon className="mr-2" />
            View Details
          </DropdownMenuItem>
          {row.original.isDraft && (
            <DropdownMenuItem>
              <EditIcon className="mr-2" />
              Edit Campaign
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
