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
import { ChatInput } from "@innocalls/chat-ui";

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
  /** Set when the agent has clicked the reply button on a message; the
   * ChatInput shows a quoted preview and the next send carries replyToId. */
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  /** Whether older messages exist beyond what's currently in `messages`.
   * Initialized from the API's hasMoreOlder on conversation load and
   * updated as the agent pages backwards. */
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  // Track which conversation `messages` belongs to so we know when to do a
  // hard reset (new conversation selected) vs. a merge (poll refresh of the
  // current one).
  const lastSyncedIdRef = useRef<string | null>(null);
  // Track which conversation we've already adopted hasMoreOlder for. When
  // a conversation is selected, the parent first sets selectedConversation
  // to a stripped list-item (no messages, no hasMoreOlder), THEN replaces
  // it with the full payload from getConversation. Without this guard, the
  // first pass would lock in hasMoreOlder=false from the stub and the
  // second pass (with the real value) would silently fall into the merge
  // branch that doesn't touch hasMoreOlder.
  const hasMoreOlderInitForIdRef = useRef<string | null>(null);

  // Sync messages from conversation prop. Switching conversations replaces
  // the list; refreshing the same conversation merges by id so a poll arriving
  // mid-send doesn't wipe a message that was just appended locally.
  useEffect(() => {
    if (!conversation) {
      setMessages([]);
      setHasMoreOlder(false);
      lastSyncedIdRef.current = null;
      hasMoreOlderInitForIdRef.current = null;
      return;
    }
    const incoming = conversation.messages ?? [];
    const incomingHasMoreOlder = conversation.hasMoreOlder;

    if (lastSyncedIdRef.current !== conversation.id) {
      lastSyncedIdRef.current = conversation.id;
      setMessages(incoming);
      // Only mark as initialized when the prop actually carries a defined
      // value — otherwise wait for the full payload to arrive.
      if (typeof incomingHasMoreOlder === "boolean") {
        setHasMoreOlder(incomingHasMoreOlder);
        hasMoreOlderInitForIdRef.current = conversation.id;
      } else {
        setHasMoreOlder(false);
      }
      return;
    }

    // Same conversation, merge by id (handles the slow-send race: a poll
    // arriving mid-send can't wipe a local optimistic row).
    setMessages((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) map.set(m.id, m);
      return Array.from(map.values()).sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    });

    // First-defined-value adopt: when getConversation lands after the
    // initial stub, take its hasMoreOlder. Skip on subsequent polls so
    // local handleLoadOlder updates aren't stomped (the API can only see
    // "more older than the latest 30", not "more older than what the
    // agent has paged in locally").
    if (
      hasMoreOlderInitForIdRef.current !== conversation.id &&
      typeof incomingHasMoreOlder === "boolean"
    ) {
      setHasMoreOlder(incomingHasMoreOlder);
      hasMoreOlderInitForIdRef.current = conversation.id;
    }
  }, [conversation?.id, conversation?.messages, conversation?.hasMoreOlder]);

  /** Load one page of older messages and prepend them to `messages`.
   * Idempotent against concurrent calls — guarded by isLoadingOlder. */
  const handleLoadOlder = async () => {
    if (!conversation || isLoadingOlder || !hasMoreOlder) return;
    const oldestId = messages[0]?.id;
    if (!oldestId) return;
    setIsLoadingOlder(true);
    try {
      const page = await omnichannelService.getOlderMessages(
        conversation.id,
        oldestId,
      );
      // Prepend; deduplicate by id in case the page somehow overlapped.
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const fresh = page.messages.filter((m) => !seen.has(m.id));
        return [...fresh, ...prev];
      });
      setHasMoreOlder(page.hasMoreOlder);
    } catch {
      // Stay loading=false so the user can scroll up again to retry; could
      // surface a toast here.
    }
    setIsLoadingOlder(false);
  };

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

  // Insert a freshly-sent message into the local list, replacing any prior
  // entry with the same id. Without this, slow sends (voice — ffmpeg +
  // upload + Meta dispatch) can be picked up by the active-conversation
  // poll BEFORE the POST response arrives, and the naive append would
  // duplicate the row when the response finally lands.
  const upsertMessage = (msg: Message) =>
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === msg.id);
      if (idx === -1) return [...prev, msg];
      const next = prev.slice();
      next[idx] = msg;
      return next;
    });

  // Snapshot replyingTo so an in-flight send keeps the right reply target
  // even if the agent clears or re-points it mid-flight.
  const consumeReplyToId = (): string | undefined => {
    const id = replyingTo?.id;
    setReplyingTo(null);
    return id;
  };

  const handleSendMessage = async (content: string) => {
    const replyToMessageId = consumeReplyToId();
    try {
      const newMsg = await omnichannelService.sendMessage(conversation.id, {
        content,
        direction: "outbound",
        senderName,
        replyToMessageId,
      });
      upsertMessage(newMsg);
      onMessageSent?.();
    } catch {
      // Could show a toast here
    }
  };

  const handleSendMedia = async (
    file: File,
    kind: "image" | "video" | "document",
    caption?: string,
  ) => {
    const replyToMessageId = consumeReplyToId();
    const tempId = `temp-${kind}-${Date.now()}`;
    const previewLabel =
      kind === "image"
        ? `📷 Image${caption ? `: ${caption}` : ""}`
        : kind === "video"
          ? `🎬 Video${caption ? `: ${caption}` : ""}`
          : `📎 ${file.name}`;
    const tempMsg: Message = {
      id: tempId,
      conversationId: conversation.id,
      direction: "outbound",
      type: kind,
      content: previewLabel,
      filePath: null,
      replyToId: replyToMessageId ?? null,
      timestamp: new Date().toISOString(),
      senderName,
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const newMsg = await omnichannelService.sendMediaMessage(
        conversation.id,
        { file, type: kind, senderName, caption, replyToMessageId },
      );
      setMessages((prev) => {
        const stripped = prev.filter((m) => m.id !== tempId);
        const idx = stripped.findIndex((m) => m.id === newMsg.id);
        if (idx === -1) return [...stripped, newMsg];
        const next = stripped.slice();
        next[idx] = newMsg;
        return next;
      });
      onMessageSent?.();
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleSendVoice = async (blob: Blob, duration: number) => {
    const replyToMessageId = consumeReplyToId();
    // Optimistic pending bubble so the user sees the voice message land
    // immediately, even though dispatch can take several seconds (ffmpeg
    // conversion → Meta upload → Meta send). The MessageBubble detects the
    // `temp-voice-` id prefix and renders a spinner instead of the player.
    const tempId = `temp-voice-${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      conversationId: conversation.id,
      direction: "outbound",
      type: "voice",
      content: "Voice message",
      duration,
      filePath: null,
      replyToId: replyToMessageId ?? null,
      timestamp: new Date().toISOString(),
      senderName,
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const newMsg = await omnichannelService.sendVoiceMessage(
        conversation.id,
        {
          file: blob,
          direction: "outbound",
          senderName,
          duration,
          replyToMessageId,
        },
      );
      // Replace the temp row with the real one (or append if poll already
      // picked it up by id, dropping the temp).
      setMessages((prev) => {
        const stripped = prev.filter((m) => m.id !== tempId);
        const idx = stripped.findIndex((m) => m.id === newMsg.id);
        if (idx === -1) return [...stripped, newMsg];
        const next = stripped.slice();
        next[idx] = newMsg;
        return next;
      });
      onMessageSent?.();
    } catch {
      // Drop the pending bubble so the user knows the send failed.
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
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
          onReply={setReplyingTo}
          hasMoreOlder={hasMoreOlder}
          isLoadingOlder={isLoadingOlder}
          onLoadOlder={handleLoadOlder}
        />
        <ChatInput
          onSendText={handleSendMessage}
          onSendVoice={handleSendVoice}
          onSendMedia={handleSendMedia}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
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
