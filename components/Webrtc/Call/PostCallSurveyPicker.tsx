"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Assessment } from "@mui/icons-material";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import postCallSurveyService from "@/services/post-call-survey.service";
import { PostCallSurvey } from "@/types/api/post-call-survey";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useSip } from "@/providers/webrtc/SipProvider";
import useWebrtcStore from "@/store/webrtc.slice";
import Spinner from "@/components/ui/spinner";

const PostCallSurveyPicker = () => {
  const t = useTranslations("webrtc.postCallSurvey");
  const { currentSession, sessionState } = useSip();
  const { lastCall } = useWebrtcStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedSurvey, setSelectedSurvey] = useState<PostCallSurvey | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const number =
    currentSession?.remote_identity?.uri?.user.replace("*199", "") || "";
  const callId = lastCall?.callId || "";
  const direction =
    currentSession?.direction === "incoming" ? "inbound" : "outbound";

  const isDisabled =
    !currentSession || sessionState !== "answered" || !callId;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["post-call-survey-picker", search],
      queryFn: ({ pageParam = 1 }) =>
        postCallSurveyService.fetchAgentSurveys({
          page: pageParam,
          limit: 10,
          name: search || undefined,
        }),
      getNextPageParam: (lastPage, _, lastPageParam) => {
        const totalPages = lastPage.data?.totalPages ?? 1;
        if (lastPageParam < totalPages) {
          return lastPageParam + 1;
        }
        return undefined;
      },
      initialPageParam: 1,
      enabled: open,
    });

  const surveys =
    data?.pages.flatMap((page) => page.data?.surveys ?? []) ?? [];

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelect = (survey: PostCallSurvey) => {
    setSelectedSurvey(survey);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedSurvey) return;
    try {
      setIsAssigning(true);
      await postCallSurveyService.assignToCall({
        survey: selectedSurvey.id,
        phone: number,
        channelId: callId,
        direction,
        hasDefaultSurvey: false,
      });
      toast.success(t("toasts.assigned"), {
        description: t("toasts.assignedDescription"),
      });
      setOpen(false);
      setConfirmOpen(false);
      setSelectedSurvey(null);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
      } else {
        toast.error(t("toasts.error"), {
          description: t("toasts.errorDescription"),
        });
      }
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
            size="icon"
            disabled={isDisabled}
          >
            <Assessment />
            <p>{t("title")}</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <SearchIcon className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            <div className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {status === "pending" ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : surveys.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {t("noSurveys")}
                </p>
              ) : (
                surveys.map((survey) => (
                  <button
                    key={survey.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-start w-full"
                    onClick={() => handleSelect(survey)}
                  >
                    <Assessment className="text-gray-400" fontSize="small" />
                    <span className="font-medium">{survey.name}</span>
                  </button>
                ))
              )}
              {hasNextPage && <div ref={targetRef} className="h-1 w-full" />}
              {isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <Spinner />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirm.description", {
                name: selectedSurvey?.name || "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAssigning}>
              {t("confirm.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isAssigning}>
              {isAssigning ? <Spinner /> : t("confirm.assign")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PostCallSurveyPicker;
