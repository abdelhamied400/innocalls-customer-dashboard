import type { Message } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { DoneAll, Done } from "@mui/icons-material";
import ContactAvatar from "./ContactAvatar";
import VoiceMessage from "./VoiceMessage";

type MessageBubbleProps = {
  message: Message;
  conversationId: string;
  locale: string;
  /** Whether to show the sender name (first message in a group) */
  showSender: boolean;
  /** Whether this is the last message in a consecutive group from same sender */
  isLastInGroup: boolean;
};

const MessageBubble = ({
  message,
  conversationId,
  locale,
  showSender,
  isLastInGroup,
}: MessageBubbleProps) => {
  const isOutbound = message.direction === "outbound";

  const timeStr = new Date(message.timestamp).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex gap-2.5",
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

        {/* Bubble */}
        <div
          className={cn(
            "px-3.5 py-2",
            isOutbound
              ? "bg-primary-500 text-white"
              : "bg-white text-gray-800 border border-gray-200",
            // Rounded corners — more rounded on the "outside", flat on the grouped side
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
          )}
        >
          {message.type === "voice" ? (
            <div className="flex items-center gap-1.5">
              <VoiceMessage
                conversationId={conversationId}
                messageId={message.id}
                duration={message.duration ?? 0}
                isOutbound={isOutbound}
              />
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-all">
              {message.content}
            </p>
          )}

          {/* Timestamp + read status */}
          <div
            className={cn(
              "flex items-center gap-1 mt-1 -mb-0.5",
              isOutbound ? "justify-end" : "justify-end",
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
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
