"use client";

import { useEffect, useRef, useState } from "react";
import type { ChannelType, Conversation, Message } from "@/types/omnichannel";
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
import { ChatInput, type MediaKind } from "@innocalls-com/chat-ui";
import { toast } from "sonner";

/** Outbound media types each channel adapter accepts. Drives the
 * attachment menu in <ChatInput>: anything not listed here is hidden
 * from the agent. Mirrors what omni-channel-microservice-api currently
 * supports per provider — revisit when adding new channel SDKs. */
const ATTACHMENT_KINDS_BY_CHANNEL: Record<ChannelType, MediaKind[]> = {
  whatsapp: ["image", "video", "audio", "document"],
  live_chat: ["image", "video", "audio", "document"],
  messenger: ["image", "video", "audio", "document"],
  telegram: ["image", "video", "audio", "document"],
  instagram: ["image", "video", "document"],
  x: ["image", "video", "document"],
};

type ChatPanelProps = {
  conversation: Conversation | null;
  /** True while the parent is fetching the full conversation (messages
   * page) after a select. The chat area renders a bubble skeleton instead
   * of the stale inbox preview until this flips back to false. */
  isLoadingMessages?: boolean;
  onClose?: () => void;
  onMessageSent?: () => void;
  /** Called whenever the conversation row is mutated (status change, etc).
   *  Lets the parent update its `selectedConversation` state instantly so the
   *  UI doesn't have to wait for the next poll tick. */
  onConversationUpdated?: (updated: Conversation) => void;
  /** Fired when the agent clicks the contact card in the header. The
   * page-level owner toggles <ContactDetailsPanel> in the grid in
   * response — click once to open, click again to close. */
  onToggleContactDetails?: () => void;
};

const ALIVE_STATUSES = new Set(["active", "waiting"]);

/** Channels that enforce a 24-hour messaging window. Outside this window
 * the provider rejects sends; we mirror that on the client so the agent
 * sees the input disabled instead of getting a generic delivery error. */
const WINDOWED_CHANNELS = new Set<ChannelType>([
  "whatsapp",
  "instagram",
  "messenger",
]);
const WINDOW_MS = 24 * 60 * 60 * 1000;

/** True when the channel enforces a 24h window AND the last inbound
 * message (or last_message_at if no inbound yet) is older than 24h.
 * Computed from messages already in memory — no extra fetch. */
function isMessagingWindowExpired(
  channel: ChannelType,
  messages: Message[],
): boolean {
  if (!WINDOWED_CHANNELS.has(channel)) return false;
  const lastInbound = [...messages]
    .reverse()
    .find((m) => m.direction === "inbound");
  if (!lastInbound) return false;
  const ts = new Date(lastInbound.timestamp).getTime();
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts > WINDOW_MS;
}

const ChatPanel = ({
  conversation,
  isLoadingMessages,
  onClose,
  onMessageSent,
  onConversationUpdated,
  onToggleContactDetails,
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

  const windowExpired = isMessagingWindowExpired(conversation.channel, messages);
  const isAlive = ALIVE_STATUSES.has(conversation.status) && !windowExpired;

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

  /** Splice in the server-generated window-expired system message and mark
   * the parent conversation as closed locally so the agent sees the new
   * pill + the input disables immediately (no wait for the next poll). */
  const applyWindowExpired = (systemMessage: Message) => {
    setMessages((prev) =>
      prev.some((m) => m.id === systemMessage.id)
        ? prev
        : [...prev, systemMessage],
    );
    toast.error(
      t("windowExpired.toast") ||
        "The 24-hour messaging window has expired. This chat is now closed.",
    );
    onConversationUpdated?.({ ...conversation, status: "closed" });
  };

  const handleSendMessage = async (content: string, isPrivate?: boolean) => {
    const replyToMessageId = consumeReplyToId();
    try {
      const result = await omnichannelService.sendMessage(conversation.id, {
        content,
        direction: "outbound",
        senderName,
        replyToMessageId,
        isPrivate,
      });
      upsertMessage(result.message);
      if (result.systemMessage) applyWindowExpired(result.systemMessage);
      if (result.message.deliveryError && !result.systemMessage) {
        toast.error(result.message.deliveryError);
      } else if (!result.message.deliveryError) {
        onMessageSent?.();
      }
    } catch {
      // Could show a toast here
    }
  };

  const handleSendMedia = async (
    file: File,
    kind: "image" | "video" | "audio" | "document",
    caption?: string,
  ) => {
    const replyToMessageId = consumeReplyToId();
    const tempId = `temp-${kind}-${Date.now()}`;
    const previewLabel =
      kind === "image"
        ? `📷 Image${caption ? `: ${caption}` : ""}`
        : kind === "video"
          ? `🎬 Video${caption ? `: ${caption}` : ""}`
          : kind === "audio"
            ? `🎵 ${file.name}`
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
      const result = await omnichannelService.sendMediaMessage(
        conversation.id,
        {
          file,
          type: kind,
          senderName,
          caption,
          replyToMessageId,
        },
      );
      setMessages((prev) => {
        const stripped = prev.filter((m) => m.id !== tempId);
        const idx = stripped.findIndex((m) => m.id === result.message.id);
        if (idx === -1) return [...stripped, result.message];
        const next = stripped.slice();
        next[idx] = result.message;
        return next;
      });
      if (result.systemMessage) applyWindowExpired(result.systemMessage);
      if (result.message.deliveryError && !result.systemMessage) {
        toast.error(result.message.deliveryError);
      } else if (!result.message.deliveryError) {
        onMessageSent?.();
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  const handleRetry = async (failed: Message) => {
    try {
      const updated = await omnichannelService.retryMessage(
        conversation.id,
        failed.id,
      );
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m)),
      );
      if (updated.deliveryError) {
        toast.error(updated.deliveryError);
      } else {
        onMessageSent?.();
      }
    } catch (err: unknown) {
      const reason =
        err instanceof Error ? err.message : "Retry request failed";
      toast.error(reason);
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
      const result = await omnichannelService.sendVoiceMessage(
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
        const idx = stripped.findIndex((m) => m.id === result.message.id);
        if (idx === -1) return [...stripped, result.message];
        const next = stripped.slice();
        next[idx] = result.message;
        return next;
      });
      if (result.systemMessage) applyWindowExpired(result.systemMessage);
      if (result.message.deliveryError && !result.systemMessage) {
        toast.error(result.message.deliveryError);
      } else if (!result.message.deliveryError) {
        onMessageSent?.();
      }
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
          onToggleContactDetails={onToggleContactDetails}
        />
        <ChatMessages
          messages={messages}
          conversationId={conversation.id}
          locale={locale}
          onReply={setReplyingTo}
          onRetry={handleRetry}
          hasMoreOlder={hasMoreOlder}
          isLoadingOlder={isLoadingOlder}
          onLoadOlder={handleLoadOlder}
          isLoading={isLoadingMessages && messages.length === 0}
        />
        {windowExpired && conversation.status !== "closed" && (
          <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100 text-[12px] text-amber-700 text-center">
            {t("windowExpired.banner") ||
              "The 24-hour messaging window has expired. The customer must message first before you can reply."}
          </div>
        )}
        <ChatInput
          onSendText={handleSendMessage}
          onSendVoice={handleSendVoice}
          onSendMedia={handleSendMedia}
          attachmentKinds={ATTACHMENT_KINDS_BY_CHANNEL[conversation.channel]}
          showPrivateToggle
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
