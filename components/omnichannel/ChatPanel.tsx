"use client";

import { useEffect, useRef, useState } from "react";
import type { Conversation, Message } from "@/types/omnichannel";
import { Forum } from "@mui/icons-material";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import useAuth from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogX,
} from "@/components/ui/alert-dialog";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type ChatPanelProps = {
  conversation: Conversation | null;
  onClose?: () => void;
  onMessageSent?: () => void;
  /** Called whenever the conversation row is mutated (status change, etc).
   *  Lets the parent update its `selectedConversation` state instantly so the
   *  UI doesn't have to wait for the next poll tick. */
  onConversationUpdated?: (updated: Conversation) => void;
};

const ALIVE_STATUSES = new Set(["active", "waiting"]);

const ChatPanel = ({
  conversation,
  onClose,
  onMessageSent,
  onConversationUpdated,
}: ChatPanelProps) => {
  const t = useTranslations("omnichannel");
  const locale = useLocale();
  const { data: auth } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  // Track which conversation `messages` belongs to so we know when to do a
  // hard reset (new conversation selected) vs. a merge (poll refresh of the
  // current one).
  const lastSyncedIdRef = useRef<string | null>(null);

  // Sync messages from conversation prop. Switching conversations replaces
  // the list; refreshing the same conversation merges by id so a poll arriving
  // mid-send doesn't wipe a message that was just appended locally.
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      lastSyncedIdRef.current = null;
      return;
    }
    const incoming = conversation.messages ?? [];
    if (lastSyncedIdRef.current !== conversation.id) {
      lastSyncedIdRef.current = conversation.id;
      setMessages(incoming);
      return;
    }
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) map.set(m.id, m);
      return Array.from(map.values()).sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    });
  }, [conversation?.id, conversation?.messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && conversation && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [conversation, onClose]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
          <Forum className="text-4xl! text-gray-200" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">
            {t("selectConversation")}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {t("selectConversationHint")}
          </p>
        </div>
      </div>
    );
  }

  const senderName = auth?.user?.name ?? "Agent";

  const isAlive = ALIVE_STATUSES.has(conversation.status);

  const confirmEndChat = async () => {
    if (!conversation) return;
    try {
      const updated = await omnichannelService.updateConversation(
        conversation.id,
        { status: "closed" },
      );
      onConversationUpdated?.(updated);
      onMessageSent?.();
    } catch {
      // Could surface a toast — for now stay silent and let the agent retry.
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      const newMsg = await omnichannelService.sendMessage(conversation.id, {
        content,
        direction: "outbound",
        senderName,
      });
      setMessages((prev) => [...prev, newMsg]);
      onMessageSent?.();
    } catch {
      // Could show a toast here
    }
  };

  const handleSendVoice = async (blob: Blob, duration: number) => {
    try {
      const newMsg = await omnichannelService.sendVoiceMessage(
        conversation.id,
        {
          file: blob,
          direction: "outbound",
          senderName,
          duration,
        },
      );
      setMessages((prev) => [...prev, newMsg]);
      onMessageSent?.();
    } catch {
      // Could show a toast here
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
        <ChatHeader
          conversation={conversation}
          onClose={onClose}
          onEndChat={() => setIsEndDialogOpen(true)}
        />
        <ChatMessages
          messages={messages}
          conversationId={conversation.id}
          locale={locale}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendVoice={handleSendVoice}
          disabled={!isAlive}
        />
      </div>

      <AlertDialog open={isEndDialogOpen} onOpenChange={setIsEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End this chat?</AlertDialogTitle>
            <AlertDialogX />
            <AlertDialogDescription>
              The visitor will see that the conversation has ended and won't be
              able to reply on this thread. They can start a new chat from the
              widget any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndChat}>
              End chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatPanel;
