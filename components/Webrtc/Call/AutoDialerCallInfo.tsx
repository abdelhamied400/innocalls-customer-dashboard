"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NoteAdd } from "@mui/icons-material";
import { toast } from "sonner";
import webrtcService from "@/services/webrtc.service";
import { useTranslations } from "@/providers/TranslationProvider";
import { useSession } from "next-auth/react";

const useAutoDialerChannel = (channelId: string | undefined) => {
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
        setCallId(data.callId || null);
      })
      .catch(() => {
        // silently fail - info is optional
      });
  }, [channelId, isAgent]);

  return { information, callId };
};

const AutoDialerInfo = ({ information }: { information: string }) => {
  const t = useTranslations("webrtc.autoDialer");

  if (!information) return null;

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

const AutoDialerNotes = ({ callId }: { callId: string | null }) => {
  const t = useTranslations("webrtc.autoDialer");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { data: session } = useSession();
  const isAgent = session?.userType === "agent";

  const handleSaveNotes = async () => {
    if (!callId) return;

    setIsSaving(true);
    try {
      const saveNotes = isAgent
        ? webrtcService.saveAutoDialerChannelNotes
        : webrtcService.saveUserAutoDialerChannelNotes;
      await saveNotes(callId, notes);
      toast.success(t("notes.saveSuccess"));
      setPopoverOpen(false);
    } catch {
      toast.error(t("notes.saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  if (!callId) return null;

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="[&_svg]:size-6 h-auto w-full p-4 flex-col font-normal"
          size="icon"
        >
          <NoteAdd />
          <p>{t("notes.title")}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" portalled={false}>
        <div className="flex flex-col gap-3">
          <h4 className="font-medium text-sm">{t("notes.title")}</h4>
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
      </PopoverContent>
    </Popover>
  );
};

export { useAutoDialerChannel, AutoDialerInfo, AutoDialerNotes };
