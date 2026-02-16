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
import Link from "next/link";
import { useTranslations } from "@/providers/TranslationProvider";

type ActionsCellProps = Cell<AutoDialerCampaignCols>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("autoDialer.activeCampaigns.actionCell");
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
      toast.success(t("startModal.success"), {
        description: t("startModal.successDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("startModal.error"), {
          description:
            error.response?.data?.message || t("startModal.errorDescription"),
        });
        return;
      }
      toast.error(t("startModal.error"), {
        description: t("startModal.errorDescription"),
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
      toast.success(t("pauseModal.success"), {
        description: t("pauseModal.successDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("pauseModal.error"), {
          description:
            error.response?.data?.message || t("pauseModal.errorDescription"),
        });
        return;
      }
      toast.error(t("pauseModal.error"), {
        description: t("pauseModal.errorDescription"),
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
      toast.success(t("resumeModal.success"), {
        description: t("resumeModal.successDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("resumeModal.error"), {
          description:
            error.response?.data?.message || t("resumeModal.errorDescription"),
        });
        return;
      }
      toast.error(t("resumeModal.error"), {
        description: t("resumeModal.errorDescription"),
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
      toast.success(t("finishModal.success"), {
        description: t("finishModal.successDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("finishModal.error"), {
          description:
            error.response?.data?.message || t("finishModal.errorDescription"),
        });
        return;
      }
      toast.error(t("finishModal.error"), {
        description: t("finishModal.errorDescription"),
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
                <AlertDialogTitle>{t("startModal.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("startModal.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("startModal.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={onStart}>
                  {t("startModal.confirm")}
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
              <AlertDialogTitle>{t("pauseModal.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("pauseModal.message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("pauseModal.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onPause}>
                {t("pauseModal.confirm")}
              </AlertDialogAction>
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
              <AlertDialogTitle>{t("resumeModal.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("resumeModal.message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("resumeModal.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onResume}>
                {t("resumeModal.confirm")}
              </AlertDialogAction>
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
              <AlertDialogTitle>{t("finishModal.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("finishModal.message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("finishModal.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={onFinish}>
                {t("finishModal.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="unstyled" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <EyeIcon />
            {t("view")}
          </DropdownMenuItem>
          {row.original.isDraft && (
            <Link href={`/auto-dialer/${row.original.id}/update`}>
              <DropdownMenuItem>
                <EditIcon />
                {t("edit")}
              </DropdownMenuItem>
            </Link>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
