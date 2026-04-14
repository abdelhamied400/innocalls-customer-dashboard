export type ChannelType =
  | "whatsapp"
  | "live_chat"
  | "voice"
  | "messenger"
  | "x"
  | "instagram"
  | "telegram";

export type ConversationStatus = "active" | "waiting" | "resolved" | "closed";

export type MessageDirection = "inbound" | "outbound";

export type MessageType = "text" | "voice";

export type Channel = {
  id: string;
  type: ChannelType;
  name: string;
  status: "connected" | "disconnected" | "pending";
  description: string;
  connectedAt?: string;
};

export type Contact = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  /** Duration in seconds for voice messages */
  duration?: number;
  timestamp: string;
  senderName: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  contact: Contact;
  channel: ChannelType;
  status: ConversationStatus;
  assignedAgent?: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
};

export type OmnichannelStats = {
  totalConversations: number;
  activeConversations: number;
  waitingConversations: number;
  resolvedToday: number;
  avgResponseTime: string;
  channelBreakdown: Record<ChannelType, number>;
};
