"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import type { ChannelType, Conversation } from "@/types/omnichannel";
import ConversationList from "@/components/omnichannel/ConversationList";
import ChatPanel from "@/components/omnichannel/ChatPanel";
import FullscreenToggle from "@/components/omnichannel/FullscreenToggle";
import { Forum } from "@mui/icons-material";

const OmnichannelPage = () => {
  const t = useTranslations("omnichannel");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [channelFilter, setChannelFilter] = useState<ChannelType | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [agentFilter, setAgentFilter] = useState("all");

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    const conversations = await omnichannelService.getConversations({
      channel: channelFilter,
      status: statusFilter,
      search: searchQuery,
      agent: agentFilter,
    });
    setConversations(conversations);
    setIsLoading(false);
  }, [channelFilter, statusFilter, searchQuery, agentFilter]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 flex-1 min-h-0">
        {/* Conversation List */}
        <div className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation?.id ?? null}
            onSelect={setSelectedConversation}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            channelFilter={channelFilter}
            onChannelFilterChange={setChannelFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            agentFilter={agentFilter}
            onAgentFilterChange={setAgentFilter}
          />
        </div>

        {/* Chat Panel */}
        <div className="lg:col-span-6 xl:col-span-7 h-full overflow-hidden">
          <ChatPanel
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default OmnichannelPage;
