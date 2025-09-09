"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useWebrtcStore from "@/store/webrtc.slice";
import { useSession } from "next-auth/react";
import CallSummaryForm from "./CallSummaryForm";
import { DialogDescription } from "@radix-ui/react-dialog";

const CallSummaryModal = () => {
  const { data: session } = useSession();
  const {
    callSummaryModalOpen,
    setCallSummaryModalOpen,
    lastCall,
    clearLastCall,
  } = useWebrtcStore();

  if (session?.user.userType === "user") return null;

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
        <DialogTitle>Call Summary</DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {lastCall?.from} &rarr; {lastCall?.to} | Duration:{" "}
          {lastCall?.duration ? `${lastCall.duration} sec` : "N/A"}
          {lastCall?.status ? ` | Status: ${lastCall.status}` : ""}
          {lastCall?.callDateTime
            ? ` | Date: ${new Date(lastCall.callDateTime).toLocaleString()}`
            : ""}
        </DialogDescription>
        <CallSummaryForm />
      </DialogContent>
    </Dialog>
  );
};

export default CallSummaryModal;
