import type {
  Channel,
  ChannelType,
  Conversation,
  OmnichannelStats,
} from "@/types/omnichannel";

// ── Mock Data ────────────────────────────────────────────────────────────────

const mockChannels: Channel[] = [
  {
    id: "ch-1",
    type: "whatsapp",
    name: "WhatsApp Business",
    status: "connected",
    description: "Main WhatsApp Business API channel",
    connectedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "ch-2",
    type: "live_chat",
    name: "Website Live Chat",
    status: "connected",
    description: "Embedded chat widget on main website",
    connectedAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "ch-3",
    type: "voice",
    name: "Voice Calls",
    status: "connected",
    description: "Innocalls voice channel",
    connectedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "ch-4",
    type: "messenger",
    name: "Facebook Messenger",
    status: "connected",
    description: "Facebook page messenger integration",
    connectedAt: "2026-02-10T12:00:00Z",
  },
  {
    id: "ch-5",
    type: "x",
    name: "X (Twitter)",
    status: "connected",
    description: "X direct messages integration",
    connectedAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "ch-6",
    type: "instagram",
    name: "Instagram",
    status: "disconnected",
    description: "Instagram direct messages",
  },
  {
    id: "ch-7",
    type: "telegram",
    name: "Telegram",
    status: "connected",
    description: "Telegram bot integration",
    connectedAt: "2026-04-01T14:30:00Z",
  },
];

const agents = [
  "Sara Mohammed",
  "Khalid Nasser",
  "Amina Youssef",
  "Hassan Ali",
];

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    contact: {
      id: "c-1",
      name: "Ahmed Al-Rashid",
      phone: "+966501234567",
    },
    channel: "whatsapp",
    status: "active",
    assignedAgent: "Sara Mohammed",
    lastMessage: "I need help with my account billing issue",
    lastMessageAt: "2026-04-14T09:30:00Z",
    unreadCount: 2,
    messages: [
      {
        id: "m-1",
        conversationId: "conv-1",
        direction: "inbound",
        type: "text",
        content: "Hello, I have a question about my last invoice",
        timestamp: "2026-04-14T09:15:00Z",
        senderName: "Ahmed Al-Rashid",
        isRead: true,
      },
      {
        id: "m-2",
        conversationId: "conv-1",
        direction: "outbound",
        type: "text",
        content:
          "Hi Ahmed! I'd be happy to help you with your billing question. Could you share your account number?",
        timestamp: "2026-04-14T09:18:00Z",
        senderName: "Sara Mohammed",
        isRead: true,
      },
      {
        id: "m-3",
        conversationId: "conv-1",
        direction: "inbound",
        type: "voice",
        content: "Voice message",
        duration: 12,
        timestamp: "2026-04-14T09:22:00Z",
        senderName: "Ahmed Al-Rashid",
        isRead: true,
      },
      {
        id: "m-4",
        conversationId: "conv-1",
        direction: "inbound",
        type: "text",
        content: "I need help with my account billing issue",
        timestamp: "2026-04-14T09:30:00Z",
        senderName: "Ahmed Al-Rashid",
        isRead: false,
      },
    ],
  },
  {
    id: "conv-2",
    contact: {
      id: "c-2",
      name: "Fatima Hassan",
      phone: "+966551234567",
    },
    channel: "telegram",
    status: "waiting",
    lastMessage: "When will my order #12345 be delivered?",
    lastMessageAt: "2026-04-14T08:45:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-5",
        conversationId: "conv-2",
        direction: "inbound",
        type: "text",
        content:
          "Hello, I placed order #12345 three days ago and haven't received any shipping updates. Could you please check the status?",
        timestamp: "2026-04-14T08:45:00Z",
        senderName: "Fatima Hassan",
        isRead: false,
      },
    ],
  },
  {
    id: "conv-3",
    contact: {
      id: "c-3",
      name: "Omar Khalil",
      phone: "+966559876543",
    },
    channel: "live_chat",
    status: "active",
    assignedAgent: "Khalid Nasser",
    lastMessage: "Thank you for the quick response!",
    lastMessageAt: "2026-04-14T10:05:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m-6",
        conversationId: "conv-3",
        direction: "inbound",
        type: "text",
        content: "Hi, I need to update my phone number on my account",
        timestamp: "2026-04-14T09:50:00Z",
        senderName: "Omar Khalil",
        isRead: true,
      },
      {
        id: "m-7",
        conversationId: "conv-3",
        direction: "outbound",
        type: "text",
        content:
          "Hello Omar, I can help you with that. For security, please verify your email address on file.",
        timestamp: "2026-04-14T09:55:00Z",
        senderName: "Khalid Nasser",
        isRead: true,
      },
      {
        id: "m-8",
        conversationId: "conv-3",
        direction: "inbound",
        type: "text",
        content: "Thank you for the quick response!",
        timestamp: "2026-04-14T10:05:00Z",
        senderName: "Omar Khalil",
        isRead: true,
      },
    ],
  },
  {
    id: "conv-4",
    contact: {
      id: "c-4",
      name: "Layla Mansour",
      phone: "+966512345678",
    },
    channel: "whatsapp",
    status: "active",
    assignedAgent: "Amina Youssef",
    lastMessage: "Can you walk me through the setup process?",
    lastMessageAt: "2026-04-14T10:15:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-9",
        conversationId: "conv-4",
        direction: "inbound",
        type: "text",
        content:
          "Hi, I just signed up and I'm having trouble setting up my first campaign",
        timestamp: "2026-04-14T10:00:00Z",
        senderName: "Layla Mansour",
        isRead: true,
      },
      {
        id: "m-10",
        conversationId: "conv-4",
        direction: "outbound",
        type: "text",
        content:
          "Welcome to Innocalls, Layla! I'd love to help you get started.",
        timestamp: "2026-04-14T10:05:00Z",
        senderName: "Amina Youssef",
        isRead: true,
      },
      {
        id: "m-11",
        conversationId: "conv-4",
        direction: "inbound",
        type: "text",
        content: "Can you walk me through the setup process?",
        timestamp: "2026-04-14T10:15:00Z",
        senderName: "Layla Mansour",
        isRead: false,
      },
    ],
  },
  {
    id: "conv-5",
    contact: {
      id: "c-5",
      name: "Yusuf Al-Bakri",
      phone: "+966507654321",
    },
    channel: "x",
    status: "resolved",
    assignedAgent: "Khalid Nasser",
    lastMessage: "Great, that solves my problem. Thanks!",
    lastMessageAt: "2026-04-13T16:30:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m-12",
        conversationId: "conv-5",
        direction: "inbound",
        type: "text",
        content: "My call forwarding isn't working properly",
        timestamp: "2026-04-13T15:00:00Z",
        senderName: "Yusuf Al-Bakri",
        isRead: true,
      },
      {
        id: "m-13",
        conversationId: "conv-5",
        direction: "outbound",
        type: "voice",
        content: "Voice message",
        duration: 28,
        timestamp: "2026-04-13T15:20:00Z",
        senderName: "Khalid Nasser",
        isRead: true,
      },
      {
        id: "m-14",
        conversationId: "conv-5",
        direction: "inbound",
        type: "text",
        content: "Great, that solves my problem. Thanks!",
        timestamp: "2026-04-13T16:30:00Z",
        senderName: "Yusuf Al-Bakri",
        isRead: true,
      },
    ],
  },
  {
    id: "conv-6",
    contact: {
      id: "c-6",
      name: "Nour Abdallah",
      phone: "+966543210987",
    },
    channel: "messenger",
    status: "waiting",
    lastMessage: "Is there a bulk discount for enterprise plans?",
    lastMessageAt: "2026-04-14T07:20:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-15",
        conversationId: "conv-6",
        direction: "inbound",
        type: "text",
        content: "Is there a bulk discount for enterprise plans?",
        timestamp: "2026-04-14T07:20:00Z",
        senderName: "Nour Abdallah",
        isRead: false,
      },
    ],
  },
  {
    id: "conv-7",
    contact: {
      id: "c-7",
      name: "Tariq Saeed",
      phone: "+966508887777",
    },
    channel: "voice",
    status: "closed",
    assignedAgent: "Sara Mohammed",
    lastMessage: "Voice call ended - 4m 32s",
    lastMessageAt: "2026-04-13T14:00:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m-16",
        conversationId: "conv-7",
        direction: "inbound",
        type: "text",
        content: "Voice call ended - 4m 32s",
        timestamp: "2026-04-13T14:00:00Z",
        senderName: "Tariq Saeed",
        isRead: true,
      },
    ],
  },
  {
    id: "conv-8",
    contact: {
      id: "c-8",
      name: "Rania Mahmoud",
      phone: "+966506667777",
    },
    channel: "instagram",
    status: "active",
    assignedAgent: "Hassan Ali",
    lastMessage: "I saw your ad, can I get more details?",
    lastMessageAt: "2026-04-14T11:00:00Z",
    unreadCount: 3,
    messages: [
      {
        id: "m-17",
        conversationId: "conv-8",
        direction: "inbound",
        type: "text",
        content: "Hi! I saw your ad on Instagram",
        timestamp: "2026-04-14T10:50:00Z",
        senderName: "Rania Mahmoud",
        isRead: true,
      },
      {
        id: "m-18",
        conversationId: "conv-8",
        direction: "outbound",
        type: "text",
        content: "Hello Rania! Thanks for reaching out. Which plan were you interested in?",
        timestamp: "2026-04-14T10:52:00Z",
        senderName: "Hassan Ali",
        isRead: true,
      },
      {
        id: "m-19",
        conversationId: "conv-8",
        direction: "inbound",
        type: "text",
        content: "I saw your ad, can I get more details?",
        timestamp: "2026-04-14T11:00:00Z",
        senderName: "Rania Mahmoud",
        isRead: false,
      },
    ],
  },
  {
    id: "conv-9",
    contact: {
      id: "c-9",
      name: "Khaled Osman",
      phone: "+966502223333",
    },
    channel: "telegram",
    status: "active",
    assignedAgent: "Sara Mohammed",
    lastMessage: "Can you help me configure my IVR?",
    lastMessageAt: "2026-04-14T10:45:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m-20",
        conversationId: "conv-9",
        direction: "inbound",
        type: "text",
        content: "Can you help me configure my IVR?",
        timestamp: "2026-04-14T10:45:00Z",
        senderName: "Khaled Osman",
        isRead: false,
      },
    ],
  },
];

const mockStats: OmnichannelStats = {
  totalConversations: 156,
  activeConversations: 23,
  waitingConversations: 8,
  resolvedToday: 42,
  avgResponseTime: "2m 15s",
  channelBreakdown: {
    whatsapp: 45,
    live_chat: 28,
    voice: 18,
    messenger: 12,
    x: 22,
    instagram: 18,
    telegram: 13,
  },
};

// ── Mock Service ─────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const omnichannelService = {
  getConversations: async (filters?: {
    channel?: ChannelType | "all";
    status?: string;
    search?: string;
    agent?: string;
  }): Promise<Conversation[]> => {
    await delay(300);
    let results = [...mockConversations];
    if (filters?.channel && filters.channel !== "all") {
      results = results.filter((c) => c.channel === filters.channel);
    }
    if (filters?.status && filters.status !== "all") {
      results = results.filter((c) => c.status === filters.status);
    }
    if (filters?.agent && filters.agent !== "all") {
      results = results.filter((c) => c.assignedAgent === filters.agent);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q),
      );
    }
    return results;
  },

  getConversation: async (id: string): Promise<Conversation | undefined> => {
    await delay(200);
    return mockConversations.find((c) => c.id === id);
  },

  getChannels: async (): Promise<Channel[]> => {
    await delay(300);
    return [...mockChannels];
  },

  getStats: async (): Promise<OmnichannelStats> => {
    await delay(200);
    return { ...mockStats };
  },

  getAgents: async (): Promise<string[]> => {
    await delay(100);
    return [...agents];
  },
};

export default omnichannelService;
