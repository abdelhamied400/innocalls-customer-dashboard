"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import type { ChannelType, Conversation } from "@/types/omnichannel";
import ConversationList from "@/components/omnichannel/ConversationList";
import ChatPanel from "@/components/omnichannel/ChatPanel";
import ContactDetailsPanel from "@/components/omnichannel/ContactDetailsPanel";
import FullscreenToggle from "@/components/omnichannel/FullscreenToggle";
import { Forum } from "@mui/icons-material";
import { usePolling } from "@/hooks/usePolling";

// Polling cadences. Visibility-aware via usePolling — paused when tab hidden.
const LIST_POLL_MS = 10_000;
const ACTIVE_CONVERSATION_POLL_MS = 5_000;

const INBOX_PAGE_SIZE = 20;

const OmnichannelPage = () => {
  const t = useTranslations("omnichannel");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  /** True while the full conversation (with its messages page) is in flight
   * after a select. Drives the skeleton inside <ChatPanel> so the agent
   * doesn't briefly see the stale single-message preview from the inbox row
   * before the real history lands. */
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  /** Open state for the right-side <ContactDetailsPanel>. The panel
   * occupies its own column in the grid below — opening rebalances the
   * widths so the chat panel just shrinks (no overlay/modal). */
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  /** Highest page we've successfully fetched. Reset to 0 on filter change. */
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filters
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  /**
   * Initial fetch + filter-driven refetch (shows the loading skeleton).
   * Called once when filters change. Resets pagination to page 1.
   */
  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await omnichannelService.getConversations({
        channel: channelFilter,
        status: statusFilter,
        search: searchQuery,
        tag: tagFilter,
        page: 1,
        limit: INBOX_PAGE_SIZE,
      });
      setConversations(result.conversations);
      setCurrentPage(1);
      setHasMore(result.totalPages > 1);
    } catch {
      setConversations([]);
      setCurrentPage(0);
      setHasMore(false);
    }
    setIsLoading(false);
  }, [channelFilter, statusFilter, searchQuery, tagFilter]);

  /**
   * Background refresh — quietly refetches page 1 only and merges into the
   * existing array by id, so subsequent paginated pages stay loaded while
   * the latest activity at the top stays current. Used for the inbox poll.
   */
  const refreshConversations = useCallback(async () => {
    try {
      const result = await omnichannelService.getConversations({
        channel: channelFilter,
        status: statusFilter,
        search: searchQuery,
        tag: tagFilter,
        page: 1,
        limit: INBOX_PAGE_SIZE,
      });
      setConversations((prev) => {
        // Page 1 is the source of truth for the latest N rows. Anything
        // outside that page is preserved as-is. New rows from the poll
        // bump existing entries (lastMessageAt updated, unreadCount, etc.).
        const map = new Map(prev.map((c) => [c.id, c]));
        for (const c of result.conversations) map.set(c.id, c);
        return Array.from(map.values()).sort(
          (a, b) =>
            new Date(b.lastMessageAt ?? 0).getTime() -
            new Date(a.lastMessageAt ?? 0).getTime(),
        );
      });
    } catch {
      // Network blip — the next tick will retry.
    }
  }, [channelFilter, statusFilter, searchQuery, tagFilter]);

  /**
   * Load the next page when the agent scrolls near the bottom of the
   * conversation list. Idempotent against concurrent calls via isLoadingMore.
   */
  const loadMoreConversations = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await omnichannelService.getConversations({
        channel: channelFilter,
        status: statusFilter,
        search: searchQuery,
        tag: tagFilter,
        page: nextPage,
        limit: INBOX_PAGE_SIZE,
      });
      setConversations((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        const fresh = result.conversations.filter((c) => !seen.has(c.id));
        return [...prev, ...fresh];
      });
      setCurrentPage(nextPage);
      setHasMore(nextPage < result.totalPages);
    } catch {
      // Stay loading=false so a subsequent scroll retries; could surface a toast.
    }
    setIsLoadingMore(false);
  }, [
    isLoadingMore,
    hasMore,
    currentPage,
    channelFilter,
    statusFilter,
    searchQuery,
    tagFilter,
  ]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Inbox poll — picks up new conversations + new last-messages while idle.
  usePolling(refreshConversations, LIST_POLL_MS);

  // Open-conversation poll — fetches the selected thread so visitor replies
  // appear without a manual refresh. Cadence is faster because this is the
  // surface the agent is actively staring at.
  const refreshSelectedConversation = useCallback(async () => {
    if (!selectedConversation) return;
    try {
      const full = await omnichannelService.getConversation(
        selectedConversation.id,
      );
      setSelectedConversation((curr) =>
        curr && curr.id === full.id ? full : curr,
      );
    } catch {
      // ignore transient errors; next tick retries
    }
  }, [selectedConversation?.id]);
  usePolling(
    refreshSelectedConversation,
    ACTIVE_CONVERSATION_POLL_MS,
    Boolean(selectedConversation),
  );

  const handleSelectConversation = async (conversation: Conversation) => {
    // Set immediately for responsiveness, then load full conversation with messages
    setSelectedConversation(conversation);
    setIsLoadingMessages(true);
    try {
      const full = await omnichannelService.getConversation(conversation.id);
      setSelectedConversation(full);
      // Mark as read
      if (full.unreadCount > 0) {
        await omnichannelService.markAsRead(full.id);
        // Update the list item's unread count
        setConversations((prev) =>
          prev.map((c) =>
            c.id === full.id ? { ...c, unreadCount: 0 } : c,
          ),
        );
      }
    } catch {
      // Keep the preview version
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleConversationUpdated = () => {
    // Refresh the list after sending a message — use the merge-preserving
    // refresh (page 1 only, merged into the existing array) so the agent's
    // loaded pages 2+ aren't wiped just because they sent a message.
    refreshConversations();
  };

  /**
   * Pushed up from ChatPanel when an in-place mutation (e.g. ending the chat)
   * already returned the new conversation row. Updates both the open thread
   * and the inbox list entry instantly, so the agent doesn't have to wait
   * for the next poll tick to see the status change.
   */
  const handleConversationMutated = (updated: Conversation) => {
    setSelectedConversation((curr) =>
      curr && curr.id === updated.id ? { ...curr, ...updated } : curr,
    );
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
    );
  };

  /** Context-menu actions on conversation rows. Each mutates the list
   * optimistically + fires the right service call. Errors are swallowed
   * silently for now — next poll tick will reconcile. */
  const handleMarkAsRead = async (conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)),
    );
    try {
      await omnichannelService.markAsRead(conv.id);
    } catch {
      /* poll will restore the correct unread count */
    }
  };

  const handleMarkAsUnread = (conv: Conversation) => {
    // No service endpoint yet — flip locally so the agent can flag it
    // visually until the API exposes a mark-as-unread route.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id ? { ...c, unreadCount: Math.max(1, c.unreadCount) } : c,
      ),
    );
  };

  const handleEndChat = async (conv: Conversation) => {
    try {
      const updated = await omnichannelService.updateConversation(conv.id, {
        status: "closed",
      });
      handleConversationMutated(updated);
    } catch {
      /* swallow */
    }
  };

  const handleReopenChat = async (conv: Conversation) => {
    try {
      const updated = await omnichannelService.updateConversation(conv.id, {
        status: "active",
      });
      handleConversationMutated(updated);
    } catch {
      /* swallow */
    }
  };

  /** Context-menu "Show info" — selects the conversation (so the chat
   * panel + details panel reflect the same target) and pops the details
   * column open in one click. */
  const handleShowInfo = (conv: Conversation) => {
    handleSelectConversation(conv);
    setIsContactDetailsOpen(true);
  };

  const handleToggleFavorite = async (conv: Conversation) => {
    const nextValue = !conv.isFavorited;
    // Optimistic flip — the API call is fire-and-forget; next poll
    // reconciles if it failed for some reason.
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id ? { ...c, isFavorited: nextValue } : c,
      ),
    );
    setSelectedConversation((curr) =>
      curr && curr.id === conv.id ? { ...curr, isFavorited: nextValue } : curr,
    );
    try {
      if (nextValue) {
        await omnichannelService.favoriteConversation(conv.id);
      } else {
        await omnichannelService.unfavoriteConversation(conv.id);
      }
    } catch {
      /* poll tick will resync */
    }
  };

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-gray-700">
          <Forum className="text-xl! text-primary-500" />
          <h2 className="text-sm font-semibold">{t("pageTitle")}</h2>
        </div>
        <FullscreenToggle />
      </div>

      {/* Main Content — 3-column grid when the contact-details panel is
          open. The chat panel just shrinks to make room; the side panels
          stay the same width. */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 flex-1 min-h-0">
        {/* Conversation List */}
        <div className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id ?? null}
            onSelect={handleSelectConversation}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            channelFilter={channelFilter}
            onChannelFilterChange={setChannelFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMoreConversations}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
            onEndChat={handleEndChat}
            onReopenChat={handleReopenChat}
            onToggleFavorite={handleToggleFavorite}
            onShowInfo={handleShowInfo}
          />
        </div>

        {/* Chat Panel — shrinks when contact details opens to make room. */}
        <div
          className={
            isContactDetailsOpen && selectedConversation
              ? "lg:col-span-3 xl:col-span-4 h-full overflow-hidden"
              : "lg:col-span-6 xl:col-span-7 h-full overflow-hidden"
          }
        >
          <ChatPanel
            conversation={selectedConversation}
            isLoadingMessages={isLoadingMessages}
            onClose={() => setSelectedConversation(null)}
            onMessageSent={handleConversationUpdated}
            onConversationUpdated={handleConversationMutated}
            onToggleContactDetails={() =>
              setIsContactDetailsOpen((v) => !v)
            }
          />
        </div>

        {/* Contact details — third column, only mounted when open AND a
            conversation is selected (closing it on conversation switch
            avoids stale notes flashing during the swap). */}
        {isContactDetailsOpen && selectedConversation && (
          <div className="lg:col-span-3 h-full overflow-hidden">
            <ContactDetailsPanel
              conversation={selectedConversation}
              onClose={() => setIsContactDetailsOpen(false)}
              onTagsChanged={(tags) => {
                setSelectedConversation((curr) =>
                  curr ? { ...curr, tags } : curr,
                );
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === selectedConversation.id ? { ...c, tags } : c,
                  ),
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OmnichannelPage;
