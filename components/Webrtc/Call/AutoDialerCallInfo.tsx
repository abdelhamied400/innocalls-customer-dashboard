"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Close, SpeakerNotes } from "@mui/icons-material";
import { toast } from "sonner";
import webrtcService from "@/services/webrtc.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { useSession } from "@/hooks/useSession";
import { format } from "date-fns";

const useAutoDialerChannel = (
  channelId: string | undefined,
  phoneNumber: string | undefined,
) => {
  const [information, setInformation] = useState("");
  const [callId, setCallId] = useState<string | null>(null);
  const { data: session } = useSession();
  const isAgent = session?.userType === "agent";

  useEffect(() => {
    if (!channelId) return;

    const fetchInfo = isAgent
      ? webrtcService.getAutoDialerChannelInfo
      : webrtcService.getUserAutoDialerChannelInfo;

    fetchInfo(channelId)
      .then((data) => {
        setInformation(data.information || "");
      })
      .catch(() => {
        // silently fail - info is optional
      });
  }, [channelId, isAgent]);

  useEffect(() => {
    if (!phoneNumber || !isAgent) return;

    webrtcService
      .getAutoDialerCallId(phoneNumber)
      .then(({ callId }) => {
        setCallId(callId || null);
      })
      .catch(() => {
        // silently fail - callId is optional
      });
  }, [phoneNumber, isAgent]);

  return { information, callId };
};

const AutoDialerInfo = ({ information }: { information: string }) => {
  const t = useTranslations("webrtc.autoDialer");

  return (
    <Textarea
      value={information}
      disabled
      rows={3}
      className="resize-none"
      placeholder={t("info.placeholder")}
    />
  );
};

const AutoDialerNotes = ({
  channelId,
  callerName,
}: {
  channelId: string | null;
  callerName?: string;
  callStartTime?: number | null;
}) => {
  const t = useTranslations("webrtc.autoDialer");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: session } = useSession();
  const isAgent = session?.userType === "agent";
  const [callTime, setCallTime] = useState("");

  const handleSaveNotes = async () => {
    if (!channelId) return;

    setIsSaving(true);
    try {
      const saveNotes = isAgent
        ? webrtcService.saveAutoDialerChannelNotes
        : webrtcService.saveUserAutoDialerChannelNotes;
      await saveNotes(channelId, notes);
      toast.success(t("notes.saveSuccess"));
      setPopoverOpen(false);
    } catch {
      toast.error(t("notes.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const callTime = format(new Date(), "hh:mm");
    setCallTime(callTime);
  }, []);

  if (!channelId) return null;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button className="[&_svg]:size-8 p-6 mx-auto rounded-full" size="icon">
          {popoverOpen ? <Close /> : <SpeakerNotes />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-3xl"
        side="top"
        portalled={false}
      >
        <div className="flex flex-col gap-3">
          <div className="bg-[url('/assets/images/notes-header.svg')] h-24 bg-no-repeat bg-cover p-4 rounded-t-3xl flex flex-col justify-center">
            {callerName && <h2 className="font-medium!">{callerName}</h2>}
            <p className="font-bold">
              {t("notes.callTime")} {callTime}
            </p>
          </div>
          <div className="content p-4 flex flex-col gap-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notes.placeholder")}
              rows={4}
            />
            <Button
              onClick={handleSaveNotes}
              disabled={isSaving || !notes.trim()}
              size="sm"
            >
              {isSaving ? t("notes.saving") : t("notes.save")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { useAutoDialerChannel, AutoDialerInfo, AutoDialerNotes };
