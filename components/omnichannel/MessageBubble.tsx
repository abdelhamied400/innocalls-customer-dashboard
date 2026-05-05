import type { Message } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { DoneAll, Done, Reply } from "@mui/icons-material";
import ContactAvatar from "./ContactAvatar";
import VoiceMessage from "./VoiceMessage";
import MediaMessage from "./MediaMessage";

/**
 * Replace bare http(s) URLs in a string with anchor tags. Used so that
 * location messages (which embed a Google Maps link) and any other text
 * containing URLs become clickable.
 */
function linkifyText(text: string, isOutbound: boolean) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "underline break-all",
            isOutbound ? "text-white hover:text-white/80" : "text-primary-500 hover:text-primary-600",
          )}
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type MessageBubbleProps = {
  message: Message;
  conversationId: string;
  locale: string;
  /** Whether to show the sender name (first message in a group) */
  showSender: boolean;
  /** Whether this is the last message in a consecutive group from same sender */
  isLastInGroup: boolean;
  /** When this message is a reply, the original message it quotes (resolved
   * by ChatMessages). Renders a quote chip at the top of the bubble. */
  repliedTo?: Message | null;
  /** Click on the hover reply button — ChatPanel sets replyingTo. */
  onReply?: (message: Message) => void;
};

/** Compact preview text for a quoted message — emoji label for media,
 * short text snippet for text bubbles. */
function quotePreview(m: Message): string {
  switch (m.type) {
    case "voice":
      return "🎵 Voice message";
    case "image":
      return m.content || "📷 Image";
    case "sticker":
      return "🪄 Sticker";
    case "video":
      return m.content || "🎬 Video";
    case "document":
      return m.content || "📎 Document";
    default: {
      const text = m.content?.replace(/\s+/g, " ").trim() ?? "";
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    }
  }
}

const MessageBubble = ({
  message,
  conversationId,
  locale,
  showSender,
  isLastInGroup,
  repliedTo,
  onReply,
}: MessageBubbleProps) => {
  const isOutbound = message.direction === "outbound";
  const isPending = message.id.startsWith("temp-");
  const canReply = !isPending && !!onReply;

  const timeStr = new Date(message.timestamp).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "group flex gap-2.5",
        isOutbound ? "justify-end" : "justify-start",
        !showSender && "mt-0.5",
        showSender && "mt-3 first:mt-0",
      )}
    >
      {/* Avatar — only for inbound, only on first message in group */}
      {!isOutbound && (
        <div className="w-7 shrink-0">
          {showSender && (
            <ContactAvatar
              name={message.senderName}
              size="sm"
              className="w-7 h-7 text-[10px]"
            />
          )}
        </div>
      )}

      {/* Reply button — appears on hover for outbound messages on the
          left side (so it sits between the avatar gutter and the bubble). */}
      {isOutbound && canReply && (
        <button
          type="button"
          onClick={() => onReply!(message)}
          aria-label="Reply"
          className="self-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shrink-0"
        >
          <Reply className="!text-base" />
        </button>
      )}

      <div
        className={cn("max-w-[65%] flex flex-col", isOutbound && "items-end")}
      >
        {/* Sender name label */}
        {showSender && (
          <span
            className={cn(
              "text-[11px] font-medium mb-1 px-1",
              isOutbound ? "text-primary-300" : "text-gray-400",
            )}
          >
            {message.senderName}
          </span>
        )}

        {/* Bubble — stickers render inline without the bubble background since
            they're meant to read as overlay graphics, like in WhatsApp itself. */}
        <div
          className={cn(
            message.type === "sticker"
              ? "flex flex-col items-center"
              : cn(
                  "px-3.5 py-2",
                  isOutbound
                    ? "bg-primary-500 text-white"
                    : "bg-white text-gray-800 border border-gray-200",
                  isOutbound
                    ? cn(
                        "rounded-s-2xl",
                        showSender ? "rounded-tr-2xl" : "rounded-tr-lg",
                        isLastInGroup ? "rounded-br-2xl" : "rounded-br-lg",
                      )
                    : cn(
                        "rounded-e-2xl",
                        showSender ? "rounded-tl-2xl" : "rounded-tl-lg",
                        isLastInGroup ? "rounded-bl-2xl" : "rounded-bl-lg",
                      ),
                ),
            // Image/video bubbles get tighter padding so the media touches
            // the bubble edge cleanly.
            (message.type === "image" || message.type === "video") &&
              "p-1 overflow-hidden",
          )}
        >
          {/* Quote chip — appears at the top of the bubble when this message
              is a reply to another. Stickers don't get a bubble, so we
              suppress the chip there too (the quote context isn't useful
              without a surrounding bubble to anchor it). */}
          {repliedTo && message.type !== "sticker" && (
            <div
              className={cn(
                "mb-1.5 -mx-1.5 px-2.5 py-1.5 rounded-md border-l-2 text-[12px]",
                isOutbound
                  ? "bg-white/10 border-white/40 text-white/90"
                  : "bg-gray-100 border-primary-300 text-gray-600",
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-medium mb-0.5",
                  isOutbound ? "text-white/70" : "text-primary-500",
                )}
              >
                {repliedTo.senderName}
              </p>
              <p className="truncate">{quotePreview(repliedTo)}</p>
            </div>
          )}

          {message.type === "voice" ? (
            message.id.startsWith("temp-voice-") ? (
              // Pending outbound voice — uploading + ffmpeg + Meta dispatch.
              // Show a tight spinner row sized like the eventual VoiceMessage
              // so the bubble height doesn't jump on swap.
              <div className="flex items-center gap-2 py-1.5 min-w-[160px]">
                <span
                  className={cn(
                    "inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin",
                    isOutbound ? "text-white/80" : "text-gray-500",
                  )}
                />
                <span
                  className={cn(
                    "text-[12px]",
                    isOutbound ? "text-white/80" : "text-gray-500",
                  )}
                >
                  Sending voice…
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <VoiceMessage
                  conversationId={conversationId}
                  messageId={message.id}
                  duration={message.duration ?? 0}
                  isOutbound={isOutbound}
                />
              </div>
            )
          ) : message.type === "image" ||
            message.type === "sticker" ||
            message.type === "video" ||
            message.type === "document" ? (
            message.id.startsWith("temp-") ? (
              // Pending outbound media — file uploading + Meta dispatch.
              <div
                className={cn(
                  "flex items-center gap-2 py-2 px-1",
                  message.type === "image" || message.type === "video"
                    ? "min-w-[200px] min-h-[120px] justify-center"
                    : "min-w-[160px]",
                )}
              >
                <span
                  className={cn(
                    "inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin",
                    isOutbound ? "text-white/80" : "text-gray-500",
                  )}
                />
                <span
                  className={cn(
                    "text-[12px]",
                    isOutbound ? "text-white/80" : "text-gray-500",
                  )}
                >
                  Sending {message.type}…
                </span>
              </div>
            ) : (
              <MediaMessage
                conversationId={conversationId}
                messageId={message.id}
                type={message.type}
                content={message.content}
                isOutbound={isOutbound}
              />
            )
          ) : (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-all">
              {linkifyText(message.content, isOutbound)}
            </p>
          )}

          {/* Timestamp + read status — hidden for sticker (no bubble) */}
          {message.type !== "sticker" && (
            <div
              className={cn(
                "flex items-center gap-1 mt-1 -mb-0.5",
                isOutbound ? "justify-end" : "justify-end",
                (message.type === "image" || message.type === "video") &&
                  "px-1.5 pb-0.5",
              )}
            >
              <span
                className={cn(
                  "text-[10px]",
                  isOutbound ? "text-white/50" : "text-gray-300",
                )}
              >
                {timeStr}
              </span>
              {isOutbound &&
                (message.isRead ? (
                  <DoneAll className={cn("text-[13px]!", "text-white/50")} />
                ) : (
                  <Done className={cn("text-[13px]!", "text-white/40")} />
                ))}
            </div>
          )}
        </div>

        {/* Sticker timestamp — sits below the inline image since there's no bubble */}
        {message.type === "sticker" && (
          <div
            className={cn(
              "flex items-center gap-1 mt-0.5",
              isOutbound ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-[10px] text-gray-400">{timeStr}</span>
            {isOutbound &&
              (message.isRead ? (
                <DoneAll className="text-[13px]! text-gray-400" />
              ) : (
                <Done className="text-[13px]! text-gray-400" />
              ))}
          </div>
        )}
      </div>

      {/* Inbound-side reply button — sits to the right of the bubble. */}
      {!isOutbound && canReply && (
        <button
          type="button"
          onClick={() => onReply!(message)}
          aria-label="Reply"
          className="self-center w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-primary-500 hover:border-primary-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shrink-0"
        >
          <Reply className="!text-base" />
        </button>
      )}
    </div>
  );
};

export default MessageBubble;
