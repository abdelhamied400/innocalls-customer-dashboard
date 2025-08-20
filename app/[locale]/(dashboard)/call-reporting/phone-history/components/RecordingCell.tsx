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
import SoundPlayer from "@/components/SoundPlayer";
import { RecordingCellProps } from "../types";

export const RecordingCell = ({ callId }: RecordingCellProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

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
          <DialogTitle>Call Recording</DialogTitle>
        </DialogHeader>
        {recordingUrl && (
          <SoundPlayer
            label={recordingUrl.split("/").pop() || "Recording"}
            url={recordingUrl}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
