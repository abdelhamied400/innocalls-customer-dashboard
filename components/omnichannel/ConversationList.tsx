import type { ChannelType, Conversation } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { Search } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import ConversationItem from "./ConversationItem";

const allChannels: ChannelType[] = [
  "whatsapp",
  "live_chat",
  "messenger",
  "x",
  "instagram",
  "telegram",
];

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  channelFilter: ChannelType | "all";
  onChannelFilterChange: (ch: ChannelType | "all") => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
};

const ConversationList = ({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  searchQuery,
  onSearchChange,
  channelFilter,
  onChannelFilterChange,
  statusFilter,
  onStatusFilterChange,
}: ConversationListProps) => {
  const t = useTranslations("omnichannel");

  const statusFilters = ["all", "active", "waiting", "resolved", "closed"];

  return (
    <div className="flex flex-col overflow-hidden h-full bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Search */}
      <div className="p-3.5 border-b border-gray-100 space-y-2.5 shrink-0">
        <div className="relative group">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-300 !text-[18px] transition-colors group-focus-within:text-primary-500" />
          <input
            type="text"
            placeholder={t("search.placeholder")}
            className="w-full h-10 ps-10 pe-4 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Channel Pills - horizontally scrollable */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            onClick={() => onChannelFilterChange("all")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap shrink-0",
              channelFilter === "all"
                ? "bg-primary-500 text-white shadow-sm"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100",
            )}
          >
            {t("filters.all")}
          </button>
          {allChannels.map((ch) => (
            <button
              key={ch}
              onClick={() => onChannelFilterChange(ch)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1 whitespace-nowrap shrink-0",
                channelFilter === ch
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100",
              )}
            >
              <ChannelIcon
                channel={ch}
                className={cn(
                  "!text-[12px]",
                  channelFilter === ch && "!text-white",
                )}
              />
              {channelLabels[ch]}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0",
                statusFilter === s
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
              )}
            >
              {t(`filters.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border-b border-gray-50 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && conversations.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm p-8 text-center">
            {t("noConversations")}
          </div>
        )}
        {!isLoading &&
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedId === conv.id}
              onClick={() => onSelect(conv)}
            />
          ))}
      </div>

      {/* Footer count */}
      {!isLoading && conversations.length > 0 && (
        <div className="px-3.5 py-2 border-t border-gray-50 text-[11px] text-gray-400 text-center shrink-0">
          {conversations.length} {t("conversationCount")}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
