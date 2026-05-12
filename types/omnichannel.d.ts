export type ChannelType =
  | "whatsapp"
  | "live_chat"
  | "messenger"
  | "x"
  | "instagram"
  | "telegram";

export type ChannelStatus = "connected" | "disconnected" | "pending";

export type ConversationStatus = "active" | "waiting" | "resolved" | "closed";

export type MessageDirection = "inbound" | "outbound";

export type MessageType =
  | "text"
  | "voice"
  | "audio"
  | "image"
  | "sticker"
  | "video"
  | "document";

export type Channel = {
  id: string;
  type: ChannelType;
  name: string;
  status: ChannelStatus;
  description: string | null;
  config: Record<string, unknown>;
  /** Public widget token — populated for `live_chat` channels only. */
  widgetToken?: string | null;
  connectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export type Message = {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  duration?: number | null;
  filePath?: string | null;
  /** External provider message id (e.g. WhatsApp wamid). Used to plumb
   * reply context through the provider; not displayed. */
  wamid?: string | null;
  /** Local id of the message this one is a reply to. Render the quoted
   * preview in MessageBubble by looking it up in the same conversation's
   * message array. */
  replyToId?: string | null;
  /** Outbound dispatch error — present when the API saved the message
   * but the channel adapter refused delivery. Bubble shows an inline
   * error row + retry button; cleared on successful retry. */
  deliveryError?: string | null;
  timestamp: string;
  senderName: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  contact: Contact;
  channel: ChannelType;
  status: ConversationStatus;
  assignedAgent?: string | null;
  assignedAgentName?: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  messages: Message[];
  /** True when older messages exist beyond the initial page returned by the
   * API. The dashboard uses this to gate the scroll-up infinite pagination. */
  hasMoreOlder?: boolean;
};

export type OmnichannelStats = {
  totalConversations: number;
  activeConversations: number;
  waitingConversations: number;
  resolvedToday: number;
  avgResponseTime: string;
  channelBreakdown: Record<ChannelType, number>;
};

export type ChannelConfigField = {
  key: string;
  label: string;
  type: "text" | "password" | "url" | "number" | "boolean" | "select" | "list";
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type ChannelSetupStep = {
  order: number;
  title: string;
  description: string;
  externalUrl?: string;
};

export type ChannelConfigSchema = {
  fields: ChannelConfigField[];
  steps: ChannelSetupStep[];
};
