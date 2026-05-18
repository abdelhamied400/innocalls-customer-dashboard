import type { ChannelType, Conversation } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import { Search } from "@mui/icons-material";
import { STATUS_META, type StatusKey } from "./status-meta";
import { useTranslations } from "@/providers/TranslationProvider";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import ConversationItem from "./ConversationItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  /** True when more pages exist beyond what's loaded. Drives the
   * scroll-near-bottom trigger and the loading indicator. */
  hasMore?: boolean;
  /** True while a load-more fetch is in flight — gates concurrent calls
   * and renders the spinner at the bottom of the list. */
  isLoadingMore?: boolean;
  /** Fired when the agent scrolls within 300px of the bottom of the list.
   * Owner is responsible for advancing the page cursor + appending. */
  onLoadMore?: () => void;
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
  hasMore,
  isLoadingMore,
  onLoadMore,
}: ConversationListProps) => {
  const t = useTranslations("omnichannel");

  const statusFilters: StatusKey[] = ["all", "active", "waiting", "closed"];

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

        {/* Channel pills — icon-only buttons. Hovering surfaces the channel
            name in a tooltip above the icon so nothing in the row ever shifts
            or overlaps. The active filter expands inline (icon + label) so
            the current selection is always legible. Horizontally scrollable
            when the panel is narrower than the row of pills. */}
        <TooltipProvider delayDuration={200}>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => onChannelFilterChange("all")}
              className={cn(
                "shrink-0 inline-flex items-center h-9 rounded-full border transition-colors px-3 text-[12px] font-semibold whitespace-nowrap",
                channelFilter === "all"
                  ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600",
              )}
            >
              {t("filters.all")}
            </button>
            {allChannels.map((ch) => {
              const isActive = channelFilter === ch;
              if (isActive) {
                return (
                  <button
                    key={ch}
                    onClick={() => onChannelFilterChange(ch)}
                    className="shrink-0 inline-flex items-center h-9 rounded-full border transition-colors px-3 gap-2 bg-primary-500 text-white border-primary-500 shadow-sm"
                  >
                    <ChannelIcon
                      channel={ch}
                      className="!text-[18px] shrink-0 !text-white"
                    />
                    <span className="text-[12px] font-semibold whitespace-nowrap">
                      {channelLabels[ch]}
                    </span>
                  </button>
                );
              }
              return (
                <Tooltip key={ch}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onChannelFilterChange(ch)}
                      aria-label={channelLabels[ch]}
                      className={cn(
                        "shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full border transition-colors",
                        "bg-white text-gray-600 border-gray-200",
                        "hover:border-primary-300 hover:text-primary-600 hover:shadow-sm",
                      )}
                    >
                      <ChannelIcon
                        channel={ch}
                        className="!text-[18px]"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-[11px] py-1 px-2">
                    {channelLabels[ch]}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Status filters — segmented control. Horizontally scrollable so
            additional statuses (or longer translated labels) don't squeeze
            the row; the active tab gets a white "lifted" surface with a
            soft shadow, evoking iOS-style segmented controls. */}
        <div className="flex p-0.5 bg-gray-100/80 rounded-lg gap-0.5 overflow-x-auto scrollbar-none">
          {statusFilters.map((s) => {
            const meta = STATUS_META[s];
            const Icon = meta?.icon;
            const isActive = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => onStatusFilterChange(s)}
                className={cn(
                  "shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap",
                  "transition-all duration-150",
                  isActive
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "!text-[14px] shrink-0",
                      isActive ? meta.activeTone : meta.inactiveTone,
                    )}
                  />
                )}
                {t(`filters.${s}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto"
        onScroll={(e) => {
          if (!hasMore || isLoadingMore || !onLoadMore) return;
          const target = e.currentTarget;
          // Fire when the agent is within 300px of the bottom — gives
          // the next page a head start so they rarely see the spinner.
          const distFromBottom =
            target.scrollHeight - target.scrollTop - target.clientHeight;
          if (distFromBottom < 300) onLoadMore();
        }}
      >
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

        {/* Load-more spinner — appears below the last row while paging.
            When hasMore is false, nothing renders here and the list ends
            cleanly with the footer count below. */}
        {!isLoading && isLoadingMore && (
          <div className="flex items-center justify-center py-3">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
          </div>
        )}
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
