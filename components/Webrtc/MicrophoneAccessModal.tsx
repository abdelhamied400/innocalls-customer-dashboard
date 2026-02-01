"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import { Mic } from "lucide-react";

type MicrophoneAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

const MicrophoneAccessModal = ({
  open,
  onClose,
}: MicrophoneAccessModalProps) => {
  const t = useTranslations("webrtc.microphoneAccess");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
            <Mic className="h-8 w-8 text-pink-600" />
          </div>
          <DialogTitle className="text-center">{t("title")}</DialogTitle>
          <DialogDescription className="text-center">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">{t("steps.title")}</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t("steps.step1")}</li>
              <li>{t("steps.step2")}</li>
              <li>{t("steps.step3")}</li>
              <li>{t("steps.step4")}</li>
            </ol>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          {t("dismiss")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MicrophoneAccessModal;
