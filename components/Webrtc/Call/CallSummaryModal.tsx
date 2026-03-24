"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useWebrtcStore from "@/store/webrtc.slice";
import { useSession } from "@/hooks/useSession";
import CallSummaryForm from "./CallSummaryForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuthStore from "@/store/auth.slice";
import { useEffect, useState } from "react";

const CallSummaryModal = () => {
  const { data: session } = useSession();
  const { Organization } = useAuthStore();
  const {
    callSummaryModalOpen,
    setCallSummaryModalOpen,
    lastCall,
    clearLastCall,
  } = useWebrtcStore();
  const t = useTranslations("webrtc.summary");

  if (session?.userType === "user" || !Organization?.enableAfterCallTags)
    return null;

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
      <DialogContent
        className="max-h-[90vh] overflow-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {lastCall?.from} &rarr; {lastCall?.to} |{" "}
          {t("conclusion.fields.duration")}:{" "}
          {lastCall?.duration
            ? `${lastCall.duration} ${t("conclusion.duration.sec")}`
            : `0 ${t("conclusion.duration.sec")}`}
          {lastCall?.status
            ? ` | ${t("conclusion.fields.status")}: ${t(
                `conclusion.status.${lastCall.status.toLocaleLowerCase()}`,
              )}`
            : ""}
          {lastCall?.callDateTime
            ? ` | ${t("conclusion.fields.date")}: ${new Date(
                lastCall.callDateTime,
              ).toLocaleString()}`
            : ""}
        </DialogDescription>
        <CallSummaryForm />
      </DialogContent>
    </Dialog>
  );
};

export default CallSummaryModal;
