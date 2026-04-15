export type ChannelType =
  | "whatsapp"
  | "live_chat"
  | "voice"
  | "messenger"
  | "x"
  | "instagram"
  | "telegram";

export type ChannelStatus = "connected" | "disconnected" | "pending";

export type ConversationStatus = "active" | "waiting" | "resolved" | "closed";

export type MessageDirection = "inbound" | "outbound";

export type MessageType = "text" | "voice";

export type Channel = {
  id: string;
  type: ChannelType;
  name: string;
  status: ChannelStatus;
  description: string | null;
  config: Record<string, unknown>;
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
