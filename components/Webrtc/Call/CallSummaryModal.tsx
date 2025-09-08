"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useWebrtcStore from "@/store/webrtc.slice";
import { useSession } from "next-auth/react";
import CallSummaryForm from "./CallSummaryForm";

const CallSummaryModal = () => {
  const { data: session } = useSession();
  // const { callSummaryModalOpen, setCallSummaryModalOpen } = useWebrtcStore();

  if (session?.user.userType === "user") return null;

  return (
    // <Dialog open={callSummaryModalOpen} onOpenChange={setCallSummaryModalOpen}>
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-h-[90vh] overflow-auto">
        <DialogTitle>Call Summary</DialogTitle>
        <CallSummaryForm />
      </DialogContent>
    </Dialog>
  );
};

export default CallSummaryModal;
