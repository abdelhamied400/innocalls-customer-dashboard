import type { Conversation } from "@/types/omnichannel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Close, DoNotDisturbOn, Person } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import ContactAvatar from "./ContactAvatar";
import { STATUS_META, type StatusKey } from "./status-meta";

const statusVariants: Record<string, string> = {
  active: "success",
  waiting: "warning",
  resolved: "info",
  closed: "secondary",
};

type ChatHeaderProps = {
  conversation: Conversation;
  onClose?: () => void;
  onEndChat?: () => void;
  /** Click handler for the contact card. The page mounts a right-side
   * <ContactDetailsPanel> when this fires; closing happens from the
   * panel's own X button. */
  onOpenContactDetails?: () => void;
};

const ALIVE_STATUSES = new Set(["active", "waiting"]);

const ChatHeader = ({
  conversation,
  onClose,
  onEndChat,
  onOpenContactDetails,
}: ChatHeaderProps) => {
  const t = useTranslations("omnichannel");
  const canEnd = onEndChat && ALIVE_STATUSES.has(conversation.status);

  return (
    <div className="px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
      {/* The contact card is the trigger for the right-side details panel —
          clicking opens contact info + the org-wide notes alongside the
          chat (not as a modal). */}
      <button
        type="button"
        onClick={onOpenContactDetails}
        className="flex items-center gap-3 text-start rounded-lg -mx-2 px-2 py-1 hover:bg-gray-50 transition-colors"
        aria-label={t("contactDetails.open")}
      >
        <ContactAvatar name={conversation.contact.name} />
        <div>
          <h3 className="font-semibold text-sm text-gray-900">
            {conversation.contact.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <ChannelIcon
              channel={conversation.channel}
              className="!text-sm"
            />
            <span>{channelLabels[conversation.channel]}</span>
            {conversation.contact.phone && (
              <>
                <span className="text-gray-300">|</span>
                <span>{conversation.contact.phone}</span>
              </>
            )}
          </div>
        </div>
      </button>
      <div className="flex items-center gap-2">
        {conversation.assignedAgent && (
          <Badge variant="secondary" className="text-xs gap-1 font-normal">
            <Person className="!text-sm" />
            {conversation.assignedAgent}
          </Badge>
        )}
        <Badge
          variant={(statusVariants[conversation.status] as any) ?? "secondary"}
          className="text-xs inline-flex items-center gap-1"
        >
          {(() => {
            const Icon = STATUS_META[conversation.status as StatusKey]?.icon;
            return Icon ? <Icon className="!text-sm shrink-0" /> : null;
          })()}
          {t(`status.${conversation.status}`)}
        </Badge>
        {canEnd && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-lg text-xs h-7 px-2.5 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
            onClick={onEndChat}
          >
            <DoNotDisturbOn className="!text-sm" />
            End chat
          </Button>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-gray-600"
            onClick={onClose}
            title="Close (Esc)"
          >
            <Close className="!text-lg" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
