"use client";
import { Button } from "@/components/ui/button";
import {
  PlayArrow,
  Pause,
  Stop,
  Autorenew,
  AssignmentLate,
  Download,
} from "@mui/icons-material";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useTranslations } from "@/providers/TranslationProvider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import callSurveyService from "@/services/call-survey.service";
import { TERMINAL_STATUSES } from "@/constants/call-survey";
import { useParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";

type SurveyActionsProps = {
  surveyId: string;
  status: string;
  isDraft: boolean;
  showUncompleted?: boolean;
};

const SurveyActions = ({
  surveyId,
  status,
  isDraft,
  showUncompleted = false,
}: SurveyActionsProps) => {
  const isTerminal = TERMINAL_STATUSES.includes(status);
  const hasActions =
    (isDraft && ["customers-inserted", "corrupted-ignored"].includes(status)) ||
    ["in-progress", "active", "paused"].includes(status) ||
    (showUncompleted && ["paused", "active", "in-progress"].includes(status)) ||
    isTerminal;

  const t = useTranslations("callSurvey.active");
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [isExporting, setIsExporting] = useState(false);

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["call-survey-active-list"] });
    queryClient.invalidateQueries({ queryKey: ["call-survey-finished-list"] });
    queryClient.invalidateQueries({ queryKey: ["call-survey-detail"] });
  };

  const onStart = async () => {
    try {
      setIsStarting(true);
      await callSurveyService.startSurvey(surveyId);
      refetch();
      toast.success(t("toasts.started"), {
        description: t("toasts.startedDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsStarting(false);
    }
  };

  const onPause = async () => {
    try {
      setIsPausing(true);
      await callSurveyService.pauseSurvey(surveyId);
      refetch();
      toast.success(t("toasts.paused"), {
        description: t("toasts.pausedDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsPausing(false);
    }
  };

  const onResume = async () => {
    try {
      setIsResuming(true);
      await callSurveyService.resumeSurvey(surveyId);
      refetch();
      toast.success(t("toasts.resumed"), {
        description: t("toasts.resumedDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsResuming(false);
    }
  };

  const onFinish = async () => {
    try {
      setIsFinishing(true);
      await callSurveyService.finishSurvey(surveyId);
      refetch();
      toast.success(t("toasts.finished"), {
        description: t("toasts.finishedDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const handleExport = async () => {
    if (!id) return;
    try {
      setIsExporting(true);
      await callSurveyService.exportStats(id);
      toast.success(t("exportSuccess"), {
        description: t("exportSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("exportError"), {
          description:
            error.response?.data?.message || t("exportErrorDescription"),
        });
        return;
      }
      toast.error(t("exportError"), {
        description: t("exportErrorDescription"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasActions) return null;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* Start — isDraft && (customers-inserted or corrupted-ignored) */}
        {isDraft &&
          ["customers-inserted", "corrupted-ignored"].includes(status) && (
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost-primary"
                      size="icon"
                      disabled={isStarting}
                    >
                      {isStarting ? (
                        <Autorenew className="animate-spin" fontSize="small" />
                      ) : (
                        <PlayArrow fontSize="small" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{t("modals.start.title")}</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("modals.start.title")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("modals.start.message")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("modals.start.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={onStart}>
                    {t("modals.start.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        {/* Pause — in-progress or active */}
        {["in-progress", "active"].includes(status) && (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-warning"
                    size="icon"
                    disabled={isPausing}
                  >
                    {isPausing ? (
                      <Autorenew className="animate-spin" fontSize="small" />
                    ) : (
                      <Pause fontSize="small" />
                    )}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("modals.pause.title")}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("modals.pause.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("modals.pause.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("modals.pause.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onPause}>
                  {t("modals.pause.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Resume — paused */}
        {status === "paused" && (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-primary"
                    size="icon"
                    disabled={isResuming}
                  >
                    {isResuming ? (
                      <Autorenew className="animate-spin" fontSize="small" />
                    ) : (
                      <PlayArrow fontSize="small" />
                    )}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("modals.resume.title")}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("modals.resume.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("modals.resume.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("modals.resume.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onResume}>
                  {t("modals.resume.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Finish — in-progress, active, or paused */}
        {["in-progress", "active", "paused"].includes(status) && (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-destructive"
                    size="icon"
                    disabled={isFinishing}
                  >
                    {isFinishing ? (
                      <Autorenew className="animate-spin" fontSize="small" />
                    ) : (
                      <Stop fontSize="small" />
                    )}
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("modals.finish.title")}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("modals.finish.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("modals.finish.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("modals.finish.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onFinish}>
                  {t("modals.finish.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Uncompleted — paused, active, or in-progress */}
        {showUncompleted &&
          ["paused", "active", "in-progress"].includes(status) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost-warning" size="icon" asChild>
                  <Link href={`/call-survey/${surveyId}/uncompleted`}>
                    <AssignmentLate fontSize="small" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("actions.uncompleted")}</TooltipContent>
            </Tooltip>
          )}

        {isTerminal && (
          <div className="flex justify-end">
            <Button
              variant="ghost-info"
              size="icon"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Spinner />
              ) : (
                <Download sx={{ fontSize: 16 }} className="me-1" />
              )}
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default SurveyActions;
