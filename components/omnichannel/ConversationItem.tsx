import type { Conversation } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Person } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import { formatDistanceToNow } from "date-fns";
import ChannelIcon from "./ChannelIcon";
import ContactAvatar from "./ContactAvatar";

const statusVariants: Record<string, string> = {
  active: "success",
  waiting: "warning",
  resolved: "info",
  closed: "secondary",
};

type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
};

const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
}: ConversationItemProps) => {
  const t = useTranslations("omnichannel");

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-start p-3.5 transition-all border-b border-gray-50/80 cursor-pointer",
        isSelected
          ? "bg-primary-50/70 border-s-2 border-s-primary-500"
          : "hover:bg-gray-50/70",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <ContactAvatar name={conversation.contact.name} />
          {/* Channel indicator */}
          <span className="absolute -bottom-0.5 -end-0.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ChannelIcon
              channel={conversation.channel}
              className="!text-xs"
            />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "font-semibold text-[13px] truncate",
                conversation.unreadCount > 0
                  ? "text-gray-900"
                  : "text-gray-700",
              )}
            >
              {conversation.contact.name}
            </span>
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              {conversation.lastMessageAt
                ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                    addSuffix: true,
                  })
                : ""}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant={
                (statusVariants[conversation.status] as any) ?? "secondary"
              }
              className="text-[9px] px-1.5 py-0 leading-4 font-medium"
            >
              {t(`status.${conversation.status}`)}
            </Badge>
            {conversation.status === "active" && conversation.assignedAgent && (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                <Person className="!text-[12px]" />
                {conversation.assignedAgent}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-1.5">
            <p
              className={cn(
                "text-xs truncate",
                conversation.unreadCount > 0
                  ? "text-gray-700 font-medium"
                  : "text-gray-400",
              )}
            >
              {conversation.lastMessage}
            </p>
            {conversation.unreadCount > 0 && (
              <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
