"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useWebrtcStore from "@/store/webrtc.slice";
import { useSession } from "next-auth/react";
import CallSummaryForm from "./CallSummaryForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslations } from "@/providers/TranslationProvider";

const CallSummaryModal = () => {
  const { data: session } = useSession();
  const {
    callSummaryModalOpen,
    setCallSummaryModalOpen,
    lastCall,
    clearLastCall,
  } = useWebrtcStore();

  if (session?.userType === "user") return null;

  const t = useTranslations("webrtc.summary");

  const onCallSummaryModalOpenChange = (open: boolean) => {
    setCallSummaryModalOpen(open);
    if (!open) {
      clearLastCall();
    }
  };

  return (
    <Dialog
      open={callSummaryModalOpen}
      onOpenChange={onCallSummaryModalOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {lastCall?.from} &rarr; {lastCall?.to} |{" "}
          {t("conclusion.fields.duration")}:{" "}
          {lastCall?.duration
            ? `${lastCall.duration} ${t("conclusion.duration.sec")}`
            : `0 ${t("conclusion.duration.sec")}`}
          {lastCall?.status
            ? ` | ${t("conclusion.fields.status")}: ${t(
                `conclusion.status.${lastCall.status.toLocaleLowerCase()}`
              )}`
            : ""}
          {lastCall?.callDateTime
            ? ` | ${t("conclusion.fields.date")}: ${new Date(
                lastCall.callDateTime
              ).toLocaleString()}`
            : ""}
        </DialogDescription>
        <CallSummaryForm />
      </DialogContent>
    </Dialog>
  );
};

export default CallSummaryModal;
