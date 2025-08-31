import StreamingSoundPlayer from "@/components/StreamingSoundPlayer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import callReportingService from "@/services/call-reporting.service";
import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { PlayCircle } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import { useMemo, useState } from "react";

const CallRecordingCell = ({ row }: Cell<Call>) => {
  const hasRecording = row.original.hasRecording;
  const callId = row.original.id;
  const { toast } = useToast();
  const t = useTranslations("callReporting.recording");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const recordingFileName = useMemo(() => {
    if (recordingUrl) {
      const urlParts = recordingUrl.split("/");
      return urlParts[urlParts.length - 1];
    }
    return null;
  }, [recordingUrl]);

  const getRecording = async (callId: string) => {
    try {
      setIsLoading(true);
      const recordingUrl = await callReportingService.getCallRecording(callId);
      setRecordingUrl(recordingUrl);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      });
      console.error("Error fetching recording:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    hasRecording && (
      <>
        <Button
          size="icon"
          variant="ghost-success"
          onClick={() => getRecording(callId)}
          loading={isLoading}
        >
          <PlayCircle />
        </Button>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogTitle>{t("title")}</DialogTitle>
            {recordingUrl && (
              <StreamingSoundPlayer label={recordingFileName} url={recordingUrl} />
            )}
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

export default CallRecordingCell;
