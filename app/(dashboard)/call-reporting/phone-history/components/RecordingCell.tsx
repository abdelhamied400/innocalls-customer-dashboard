import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlayCircle } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import callReportingService from "@/services/call-reporting.service";
import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";
import { RecordingCellProps } from "../types";
import { useTranslations } from "@/providers/TranslationProvider";

export const RecordingCell = ({ callId }: RecordingCellProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const t = useTranslations("callReporting.phoneHistory.recording");

  const getRecording = async () => {
    setIsLoading(true);
    try {
      const url = await callReportingService.getCallRecording(callId);
      setRecordingUrl(url);
    } catch (error) {
      console.error("Failed to get recording:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          getRecording();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost-success"
          loading={isLoading}
          disabled={isLoading}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <PlayCircle />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        {!isLoading && recordingUrl && (
          <StreamingSoundPlayer
            label={recordingUrl.split("/").pop() || t("title")}
            url={recordingUrl}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
