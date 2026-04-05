"use client";
import { CallSurvey } from "@/types/callSurvey";
import { Cell } from "@/types/cell";
import { Button } from "@/components/ui/button";
import {
  Visibility,
  PlayArrow,
  Pause,
  Stop,
  Autorenew,
  MoreVert,
  PersonAdd,
  Warning,
  List,
  AssignmentLate,
  BarChart,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/providers/TranslationProvider";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import callSurveyService from "@/services/call-survey.service";

type ActionsCellProps = Cell<CallSurvey>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callSurvey.active");
  const survey = row.original;
  const [isStarting, setIsStarting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const queryClient = useQueryClient();

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ["call-survey-active-list"] });
    queryClient.invalidateQueries({ queryKey: ["call-survey-finished-list"] });
  };

  const onStart = async () => {
    try {
      setIsStarting(true);
      await callSurveyService.startSurvey(survey.id);
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
      await callSurveyService.pauseSurvey(survey.id);
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
      await callSurveyService.resumeSurvey(survey.id);
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
      await callSurveyService.finishSurvey(survey.id);
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

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* Start — isDraft && (customers-inserted or corrupted-ignored) */}
        {survey.isDraft &&
          ["customers-inserted", "corrupted-ignored"].includes(
            survey.status,
          ) && (
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
        {["in-progress", "active"].includes(survey.status) && (
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
        {survey.status === "paused" && (
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
        {["in-progress", "active", "paused"].includes(survey.status) && (
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

        {/* Metrics — active */}
        {["active"].includes(survey.status) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost-primary" size="icon" asChild>
                <Link
                  href={`/call-survey/active/metrics?id=${survey.id}`}
                >
                  <BarChart fontSize="small" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("actions.metrics")}</TooltipContent>
          </Tooltip>
        )}

        {/* View details — always */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost-primary" size="icon" asChild>
              <Link href={`/call-survey/${survey.id}`}>
                <Visibility fontSize="small" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.view")}</TooltipContent>
        </Tooltip>

        {/* Dropdown — extra actions */}
        {[
          "created",
          "verification-failed",
          "completed",
          "finished",
          "paused",
          "active",
          "in-progress",
        ].includes(survey.status) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="unstyled" size="icon">
                <MoreVert fontSize="small" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {survey.status === "created" && (
                <Link href={`/call-survey/${survey.id}/attach-customers`}>
                  <DropdownMenuItem>
                    <PersonAdd fontSize="small" />
                    {t("actions.addCustomers")}
                  </DropdownMenuItem>
                </Link>
              )}
              {survey.status === "verification-failed" && (
                <Link href={`/call-survey/${survey.id}/corrupted-rows`}>
                  <DropdownMenuItem>
                    <Warning fontSize="small" />
                    {t("actions.corruptedRows")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["completed", "finished", "paused", "active", "in-progress"].includes(
                survey.status,
              ) && (
                <Link href={`/call-survey/${survey.id}/cdrs`}>
                  <DropdownMenuItem>
                    <List fontSize="small" />
                    {t("actions.cdrs")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["paused", "active", "in-progress"].includes(survey.status) && (
                <Link href={`/call-survey/${survey.id}/uncompleted`}>
                  <DropdownMenuItem>
                    <AssignmentLate fontSize="small" />
                    {t("actions.uncompleted")}
                  </DropdownMenuItem>
                </Link>
              )}
              {["active", "in-progress", "completed", "finished", "paused"].includes(
                survey.status,
              ) && (
                <Link
                  href={`/call-survey/active/analytics?id=${survey.id}`}
                >
                  <DropdownMenuItem>
                    <BarChart fontSize="small" />
                    {t("actions.callsAnalytics")}
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ActionsCell;
