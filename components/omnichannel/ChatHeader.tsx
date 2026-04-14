import type { Conversation } from "@/types/omnichannel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Close, Person } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import ContactAvatar from "./ContactAvatar";

const statusVariants: Record<string, string> = {
  active: "success",
  waiting: "warning",
  resolved: "info",
  closed: "secondary",
};

type ChatHeaderProps = {
  conversation: Conversation;
  onClose?: () => void;
};

const ChatHeader = ({ conversation, onClose }: ChatHeaderProps) => {
  const t = useTranslations("omnichannel");

  return (
    <div className="px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
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
      </div>
      <div className="flex items-center gap-2">
        {conversation.assignedAgent && (
          <Badge variant="secondary" className="text-xs gap-1 font-normal">
            <Person className="!text-sm" />
            {conversation.assignedAgent}
          </Badge>
        )}
        <Badge
          variant={(statusVariants[conversation.status] as any) ?? "secondary"}
          className="text-xs"
        >
          {t(`status.${conversation.status}`)}
        </Badge>
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
