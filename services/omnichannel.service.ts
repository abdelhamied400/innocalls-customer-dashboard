import axios from "axios";
import { getCookie } from "cookies-next";
import type {
  Channel,
  ChannelConfigSchema,
  ChannelType,
  Conversation,
  ConversationStatus,
  OmnichannelStats,
  Contact,
} from "@/types/omnichannel";

const OMNICHANNEL_API_URL =
  process.env.NEXT_PUBLIC_OMNICHANNEL_API_URL || "http://localhost:3001";

const omniApi = axios.create({
  baseURL: OMNICHANNEL_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

omniApi.interceptors.request.use(async (config) => {
  const organizationId = await getCookie("OrganizationId");
  if (organizationId) {
    config.headers["Organization"] = organizationId;
  }
  return config;
});

// ── Conversations ────────────────────────────────────────────────────────────

type ConversationsResponse = {
  conversations: Conversation[];
  totalItems: number;
  totalPages: number;
};

const omnichannelService = {
  getConversations: async (filters?: {
    channel?: ChannelType | "all";
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ConversationsResponse> => {
    const params = new URLSearchParams();
    if (filters?.channel && filters.channel !== "all")
      params.set("channel", filters.channel);
    if (filters?.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const res = await omniApi.get(
      `/api/omnichannel/conversations?${params.toString()}`,
    );
    return res.data.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const res = await omniApi.get(`/api/omnichannel/conversations/${id}`);
    return res.data.data;
  },

  /**
   * Fetch one page of older messages, before the message with id=beforeId.
   * Used by the dashboard's scroll-up infinite pagination — call when the
   * agent scrolls near the top of ChatMessages and `hasMoreOlder` is true.
   * Returns the page (in ascending/oldest-first order) plus a fresh
   * `hasMoreOlder` flag so the caller knows when to stop paging.
   */
  getOlderMessages: async (
    conversationId: string,
    beforeId: string,
    limit?: number,
  ): Promise<{ messages: import("@/types/omnichannel").Message[]; hasMoreOlder: boolean }> => {
    const params = new URLSearchParams({ before: beforeId });
    if (limit) params.set("limit", String(limit));
    const res = await omniApi.get(
      `/api/omnichannel/conversations/${conversationId}/messages?${params.toString()}`,
    );
    return res.data.data;
  },

  createConversation: async (data: {
    contactId: string;
    channel: ChannelType;
  }): Promise<Conversation> => {
    const res = await omniApi.post("/api/omnichannel/conversations", data);
    return res.data.data;
  },

  updateConversation: async (
    id: string,
    data: {
      status?: ConversationStatus;
      assignedAgent?: string | null;
      assignedAgentName?: string | null;
    },
  ): Promise<Conversation> => {
    const res = await omniApi.patch(
      `/api/omnichannel/conversations/${id}`,
      data,
    );
    return res.data.data;
  },

  // ── Messages ───────────────────────────────────────────────────────────────

  sendMessage: async (
    conversationId: string,
    data: {
      content: string;
      direction: "inbound" | "outbound";
      senderName: string;
      replyToMessageId?: string;
    },
  ) => {
    const res = await omniApi.post(
      `/api/omnichannel/conversations/${conversationId}/messages`,
      data,
    );
    return {
      message: res.data.data,
      systemMessage: res.data.systemMessage,
      conversationClosed: res.data.conversationClosed as boolean | undefined,
    };
  },

  sendVoiceMessage: async (
    conversationId: string,
    data: {
      file: Blob;
      direction: "inbound" | "outbound";
      senderName: string;
      duration: number;
      replyToMessageId?: string;
    },
  ) => {
    const formData = new FormData();
    formData.append("file", data.file, "recording.webm");
    formData.append("direction", data.direction);
    formData.append("senderName", data.senderName);
    formData.append("duration", String(data.duration));
    if (data.replyToMessageId)
      formData.append("replyToMessageId", data.replyToMessageId);

    const res = await omniApi.post(
      `/api/omnichannel/conversations/${conversationId}/messages/voice`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return {
      message: res.data.data,
      systemMessage: res.data.systemMessage,
      conversationClosed: res.data.conversationClosed as boolean | undefined,
    };
  },

  sendMediaMessage: async (
    conversationId: string,
    data: {
      file: File;
      type: "image" | "video" | "audio" | "document";
      senderName: string;
      caption?: string;
      replyToMessageId?: string;
    },
  ) => {
    const formData = new FormData();
    formData.append("file", data.file, data.file.name);
    formData.append("type", data.type);
    formData.append("senderName", data.senderName);
    if (data.caption) formData.append("caption", data.caption);
    if (data.replyToMessageId)
      formData.append("replyToMessageId", data.replyToMessageId);

    const res = await omniApi.post(
      `/api/omnichannel/conversations/${conversationId}/messages/media`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return {
      message: res.data.data,
      systemMessage: res.data.systemMessage,
      conversationClosed: res.data.conversationClosed as boolean | undefined,
    };
  },

  // Re-dispatch a previously failed outbound message. The API mutates the
  // existing row in place — clearing deliveryError on success, updating it
  // with the new error otherwise — and returns the updated message.
  retryMessage: async (conversationId: string, messageId: string) => {
    const res = await omniApi.post(
      `/api/omnichannel/conversations/${conversationId}/messages/${messageId}/retry`,
    );
    return res.data.data;
  },

  markAsRead: async (conversationId: string): Promise<{ updated: number }> => {
    const res = await omniApi.patch(
      `/api/omnichannel/conversations/${conversationId}/messages/read`,
    );
    return res.data.data;
  },

  /**
   * Fetch a voice message audio file as a blob URL. Goes through the
   * organization-scoped axios instance so the Organization header is set.
   */
  fetchVoiceMessageBlobUrl: async (
    conversationId: string,
    messageId: string,
  ): Promise<string> => {
    const res = await omniApi.get(
      `/api/omnichannel/conversations/${conversationId}/messages/${messageId}/audio`,
      { responseType: "blob" },
    );
    return URL.createObjectURL(res.data as Blob);
  },

  /**
   * Fetch any media message (image/sticker/video/document) as a blob URL +
   * mime type. Use this for non-voice media in MessageBubble; voice
   * messages should keep using fetchVoiceMessageBlobUrl above.
   */
  fetchMessageMediaBlobUrl: async (
    conversationId: string,
    messageId: string,
  ): Promise<{ url: string; mimeType: string }> => {
    const res = await omniApi.get(
      `/api/omnichannel/conversations/${conversationId}/messages/${messageId}/media`,
      { responseType: "blob" },
    );
    const blob = res.data as Blob;
    return { url: URL.createObjectURL(blob), mimeType: blob.type };
  },

  // ── Channels ───────────────────────────────────────────────────────────────

  /** Get the OAuth popup URL for a channel type (whatsapp, messenger, instagram) */
  getOAuthUrl: async (
    channelType: ChannelType,
  ): Promise<{ url: string; state: string }> => {
    const res = await omniApi.get(
      `/api/omnichannel/channels/oauth/${channelType}/url`,
    );
    return res.data.data;
  },

  /** Verify OAuth callback completed — poll this after the popup closes */
  getOAuthStatus: async (
    state: string,
  ): Promise<{ status: "pending" | "completed" | "failed"; channel?: Channel; error?: string }> => {
    const res = await omniApi.get(
      `/api/omnichannel/channels/oauth/status/${state}`,
    );
    return res.data.data;
  },

  getChannels: async (): Promise<Channel[]> => {
    const res = await omniApi.get("/api/omnichannel/channels");
    return res.data.data;
  },

  getChannelConfigSchema: async (): Promise<
    Record<ChannelType, ChannelConfigSchema>
  > => {
    const res = await omniApi.get("/api/omnichannel/channels/config-schema");
    return res.data.data;
  },

  createChannel: async (data: {
    type: ChannelType;
    name: string;
    description?: string;
    config: Record<string, unknown>;
  }): Promise<Channel> => {
    const res = await omniApi.post("/api/omnichannel/channels", data);
    return res.data.data;
  },

  updateChannel: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
      config?: Record<string, unknown>;
    },
  ): Promise<Channel> => {
    const res = await omniApi.patch(`/api/omnichannel/channels/${id}`, data);
    return res.data.data;
  },

  deleteChannel: async (id: string): Promise<{ success: boolean }> => {
    const res = await omniApi.delete(`/api/omnichannel/channels/${id}`);
    return res.data.data;
  },

  /** Rotate the widget token for a `live_chat` channel. */
  regenerateWidgetToken: async (id: string): Promise<Channel> => {
    const res = await omniApi.post(
      `/api/omnichannel/channels/${id}/regenerate-token`,
    );
    return res.data.data;
  },

  // ── Contacts ───────────────────────────────────────────────────────────────

  getContacts: async (filters?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    contacts: Contact[];
    totalItems: number;
    totalPages: number;
  }> => {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));

    const res = await omniApi.get(
      `/api/omnichannel/contacts?${params.toString()}`,
    );
    return res.data.data;
  },

  createContact: async (data: {
    name: string;
    phone?: string;
    email?: string;
  }): Promise<Contact> => {
    const res = await omniApi.post("/api/omnichannel/contacts", data);
    return res.data.data;
  },

  // ── Stats ──────────────────────────────────────────────────────────────────

  getStats: async (): Promise<OmnichannelStats> => {
    const res = await omniApi.get("/api/omnichannel/stats");
    return res.data.data;
  },
};

export default omnichannelService;
