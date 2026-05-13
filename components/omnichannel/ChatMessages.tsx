import type { Message } from "@/types/omnichannel";
import { MessagesScroller } from "@innocalls-com/chat-ui";
import omnichannelService from "@/services/omnichannel.service";
import ContactAvatar from "./ContactAvatar";

/**
 * Dashboard adapter around `@innocalls-com/chat-ui`'s `<MessagesScroller />`.
 *
 * Wires the dashboard-specific bits the package can't know about:
 *   - `fetchMediaUrl` — the org-scoped axios fetcher
 *   - `renderAvatar` — the dashboard's ContactAvatar
 *
 * All scrolling, pagination, lazy-loading, and bubble rendering live in
 * the package — this file just plumbs the values through.
 */

type Props = {
  messages: Message[];
  conversationId: string;
  locale: string;
  onReply?: (message: Message) => void;
  onRetry?: (message: Message) => void;
  hasMoreOlder?: boolean;
  isLoadingOlder?: boolean;
  onLoadOlder?: () => void;
};

const ChatMessages = (props: Props) => (
  <MessagesScroller
    {...props}
    fetchMediaUrl={omnichannelService.fetchMessageMediaBlobUrl}
    renderAvatar={(senderName) => (
      <ContactAvatar
        name={senderName}
        size="sm"
        className="w-7 h-7 text-[10px]"
      />
    )}
  />
);

export default ChatMessages;
