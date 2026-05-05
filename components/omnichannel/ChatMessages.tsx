import type { Message } from "@/types/omnichannel";
import MessageBubble from "./MessageBubble";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import { cn } from "@/lib/utils";

type ChatMessagesProps = {
  messages: Message[];
  conversationId: string;
  locale: string;
  /** Click on a message's reply button → ChatPanel sets replyingTo. */
  onReply?: (message: Message) => void;
  /** True when older messages exist beyond `messages`. When true, the top
   * sentinel arms the load-older trigger; when false, the trigger is
   * disabled and we render an "end of history" indicator. */
  hasMoreOlder?: boolean;
  /** True while a load-older fetch is in flight — used to gate against
   * concurrent fetches and to render the loading spinner at the top. */
  isLoadingOlder?: boolean;
  /** Called when the agent scrolls within rootMargin of the top sentinel.
   * Owner (ChatPanel) is responsible for guarding against concurrent calls
   * via isLoadingOlder. */
  onLoadOlder?: () => void;
};

/** How close to the bottom (px) we consider "at bottom" — within this
 * range, a newly-arriving message will auto-scroll. Outside it, we leave
 * the viewport alone so the agent isn't yanked away while reading. */
const NEAR_BOTTOM_PX = 200;

/** Above this distance from the bottom the floating scroll-to-bottom
 * button appears, giving the agent a one-tap way back without scrolling
 * by hand through hundreds of bubbles. */
const SHOW_SCROLL_DOWN_PX = 400;

const ChatMessages = ({
  messages,
  conversationId,
  locale,
  onReply,
  hasMoreOlder,
  isLoadingOlder,
  onLoadOlder,
}: ChatMessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  // Track the last rendered conversation so we know to do a hard jump
  // when the agent switches threads vs. a soft conditional scroll on
  // updates within the current thread.
  const lastConvIdRef = useRef<string | null>(null);
  // Track the id of the most recent message we've already scrolled for,
  // so a poll that simply re-creates the array (no new messages) won't
  // trigger any scroll at all.
  const lastSeenLastIdRef = useRef<string | null>(null);
  // Track the id of the OLDEST message currently rendered so we can
  // detect "the array got prepended" (older page loaded) vs. "the array
  // got a new bottom message" and adjust scroll position accordingly.
  const firstSeenIdRef = useRef<string | null>(null);
  // Snapshot the scroll container's scrollHeight just before a load-older
  // fetch fires; after the new bubbles render we restore scrollTop so the
  // agent's view stays anchored on what they were reading.
  const scrollHeightBeforeLoadRef = useRef<number | null>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    // Show floating scroll-to-bottom button when scrolled meaningfully up.
    const distFromBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;
    setShowScrollDown(distFromBottom > SHOW_SCROLL_DOWN_PX);

    // Top-edge load-older trigger.
    if (!hasMoreOlder || isLoadingOlder || !onLoadOlder) return;
    if (target.scrollTop > 200) return;
    scrollHeightBeforeLoadRef.current = target.scrollHeight;
    onLoadOlder();
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Index messages by id so each MessageBubble can resolve `replyToId`
  // into the original message for rendering the quote chip without
  // having to refetch or pass the whole list down.
  const messagesById = useMemo(() => {
    const map = new Map<string, Message>();
    for (const m of messages) map.set(m.id, m);
    return map;
  }, [messages]);

  // Layout effect runs synchronously after DOM mutation but before paint —
  // important so the conversation-switch jump happens BEFORE the user (or
  // the IntersectionObservers in MediaMessage / VoiceMessage) ever sees
  // the top of the list. Otherwise a smooth scroll from top to bottom
  // would drag every bubble through the viewport and trigger every
  // lazy-loaded media fetch.
  useLayoutEffect(() => {
    const firstId = messages[0]?.id ?? null;
    const lastId = messages[messages.length - 1]?.id ?? null;

    // Nothing to scroll to yet — wait for messages to actually arrive.
    if (!lastId) return;

    // Case 1 — conversation switched, or first non-empty render of this
    // conversation. Hard jump to the bottom, no animation, before the
    // browser paints so the user never sees the top of the list and the
    // IntersectionObservers don't briefly mark all bubbles as visible.
    if (lastConvIdRef.current !== conversationId) {
      lastConvIdRef.current = conversationId;
      lastSeenLastIdRef.current = lastId;
      firstSeenIdRef.current = firstId;
      scrollHeightBeforeLoadRef.current = null;
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      return;
    }

    // Case 2 — older messages were prepended (load-older returned). The
    // first id changed but the last id didn't. Restore scroll position
    // by adding the height delta to scrollTop, so the agent's view stays
    // anchored on what they were reading.
    if (
      firstSeenIdRef.current !== firstId &&
      lastId === lastSeenLastIdRef.current
    ) {
      const container = containerRef.current;
      if (container && scrollHeightBeforeLoadRef.current != null) {
        container.scrollTop =
          container.scrollHeight - scrollHeightBeforeLoadRef.current;
      }
      scrollHeightBeforeLoadRef.current = null;
      firstSeenIdRef.current = firstId;
      return;
    }

    // Case 3 — same conversation, no new bottom message (just a poll merge,
    // no prepend). Don't scroll.
    if (lastId === lastSeenLastIdRef.current) return;

    // Case 4 — same conversation, a new message arrived at the bottom.
    // Only auto-scroll if the agent was already near the bottom.
    const container = containerRef.current;
    const wasNearBottom =
      container &&
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
        NEAR_BOTTOM_PX;
    if (wasNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    lastSeenLastIdRef.current = lastId;
    firstSeenIdRef.current = firstId;
  }, [conversationId, messages]);

  return (
    <div className="relative flex-1 flex flex-col min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/60"
      >
      {/* Loading spinner above the oldest message while paging. */}
      {isLoadingOlder && (
        <div className="flex items-center justify-center py-3">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
        </div>
      )}

      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        const next = messages[idx + 1];
        const showSender = !prev || prev.direction !== msg.direction;
        const isLastInGroup = !next || next.direction !== msg.direction;
        const repliedTo = msg.replyToId
          ? (messagesById.get(msg.replyToId) ?? null)
          : null;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            conversationId={conversationId}
            locale={locale}
            showSender={showSender}
            isLastInGroup={isLastInGroup}
            repliedTo={repliedTo}
            onReply={onReply}
          />
        );
      })}
        <div ref={bottomRef} />
      </div>

      {/* Floating scroll-to-bottom button — appears when the agent has
          scrolled meaningfully up. Click jumps smoothly to the latest
          message. Sits above the ChatInput in the layout, anchored to
          the bottom-right of the messages area. */}
      <button
        type="button"
        aria-label="Scroll to latest"
        onClick={scrollToBottom}
        className={cn(
          "absolute bottom-4 end-4 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 text-gray-500 hover:text-primary-500 hover:shadow-lg flex items-center justify-center transition-all",
          showScrollDown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none",
        )}
      >
        <KeyboardArrowDown className="!text-2xl" />
      </button>
    </div>
  );
};

export default ChatMessages;
