import type { Conversation } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ContentCopy,
  DoNotDisturbOn,
  MarkChatRead,
  MarkChatUnread,
  Person,
  RestoreFromTrash,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { formatDistanceToNow } from "date-fns";
import ChannelIcon from "./ChannelIcon";
import ContactAvatar from "./ContactAvatar";
import { STATUS_META, type StatusKey } from "./status-meta";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusVariants: Record<string, string> = {
  active: "success",
  waiting: "warning",
  resolved: "info",
  closed: "secondary",
};

const ALIVE_STATUSES = new Set(["active", "waiting"]);

type ConversationItemProps = {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onMarkAsRead?: (conv: Conversation) => void;
  onMarkAsUnread?: (conv: Conversation) => void;
  onEndChat?: (conv: Conversation) => void;
  onReopenChat?: (conv: Conversation) => void;
};

const ConversationItem = ({
  conversation,
  isSelected,
  onClick,
  onMarkAsRead,
  onMarkAsUnread,
  onEndChat,
  onReopenChat,
}: ConversationItemProps) => {
  const t = useTranslations("omnichannel");

  // Context-menu state. Position the menu at the cursor on right-click; an
  // invisible 1×1 trigger anchors the Radix DropdownMenu so it inherits the
  // accessibility (focus trap, escape, outside-click) we'd otherwise have to
  // build ourselves.
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* swallow — clipboard rejection is non-fatal */
    }
  };

  const isAlive = ALIVE_STATUSES.has(conversation.status);
  const isClosed = conversation.status === "closed";
  const hasUnread = conversation.unreadCount > 0;

  return (
    <>
      <button
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={cn(
          "group relative w-full text-start p-3.5 transition-all duration-150 border-b border-gray-50/80 cursor-pointer",
          // Inset start-edge accent: visible when selected, slides in on hover
          // for non-selected rows so the agent gets a clear "this is clickable"
          // affordance without us touching the whole bg too aggressively.
          "before:absolute before:inset-y-2 before:start-0 before:w-[3px] before:rounded-e before:transition-all",
          isSelected
            ? "bg-primary-50/70 before:bg-primary-500"
            : "before:bg-transparent hover:bg-gray-50 hover:before:bg-primary-300",
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
                  hasUnread ? "text-gray-900" : "text-gray-700",
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
                className="text-[9px] px-1.5 py-0 leading-4 font-medium inline-flex items-center gap-0.5"
              >
                {(() => {
                  const Icon =
                    STATUS_META[conversation.status as StatusKey]?.icon;
                  return Icon ? (
                    <Icon className="!text-[10px] shrink-0" />
                  ) : null;
                })()}
                {t(`status.${conversation.status}`)}
              </Badge>
              {conversation.status === "active" &&
                conversation.assignedAgent && (
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
                  hasUnread
                    ? "text-gray-700 font-medium"
                    : "text-gray-400",
                )}
              >
                {conversation.lastMessage}
              </p>
              {hasUnread && (
                <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
                  {conversation.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <span
            style={{
              position: "fixed",
              top: menuPos.y,
              left: menuPos.x,
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}
            aria-hidden
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          {hasUnread && onMarkAsRead && (
            <DropdownMenuItem
              onClick={() => onMarkAsRead(conversation)}
              className="text-[12px] gap-2"
            >
              <MarkChatRead className="!text-[16px] text-gray-500" />
              {t("actions.markAsRead")}
            </DropdownMenuItem>
          )}
          {!hasUnread && onMarkAsUnread && (
            <DropdownMenuItem
              onClick={() => onMarkAsUnread(conversation)}
              className="text-[12px] gap-2"
            >
              <MarkChatUnread className="!text-[16px] text-gray-500" />
              {t("actions.markAsUnread")}
            </DropdownMenuItem>
          )}

          {conversation.contact.phone && (
            <DropdownMenuItem
              onClick={() => copy(conversation.contact.phone!)}
              className="text-[12px] gap-2"
            >
              <ContentCopy className="!text-[16px] text-gray-500" />
              {t("actions.copyPhone")}
            </DropdownMenuItem>
          )}
          {conversation.contact.email && (
            <DropdownMenuItem
              onClick={() => copy(conversation.contact.email!)}
              className="text-[12px] gap-2"
            >
              <ContentCopy className="!text-[16px] text-gray-500" />
              {t("actions.copyEmail")}
            </DropdownMenuItem>
          )}

          {(isAlive && onEndChat) || (isClosed && onReopenChat) ? (
            <DropdownMenuSeparator />
          ) : null}

          {isAlive && onEndChat && (
            <DropdownMenuItem
              onClick={() => onEndChat(conversation)}
              className="text-[12px] gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <DoNotDisturbOn className="!text-[16px]" />
              {t("actions.endChat")}
            </DropdownMenuItem>
          )}
          {isClosed && onReopenChat && (
            <DropdownMenuItem
              onClick={() => onReopenChat(conversation)}
              className="text-[12px] gap-2"
            >
              <RestoreFromTrash className="!text-[16px] text-gray-500" />
              {t("actions.reopenChat")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ConversationItem;
