import type { ChannelType, Conversation } from "@/types/omnichannel";
import { cn } from "@/lib/utils";
import {
  CalendarMonth,
  KeyboardArrowDown,
  LocalOffer,
  PriorityHigh,
  Search,
  Tune,
} from "@mui/icons-material";
import { STATUS_META, type StatusKey } from "./status-meta";
import { useState } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import ChannelIcon, { channelLabels } from "./ChannelIcon";
import ConversationItem from "./ConversationItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

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
  /** Per-conversation actions, plumbed through to each row's context menu. */
  onMarkAsRead?: (conv: Conversation) => void;
  onMarkAsUnread?: (conv: Conversation) => void;
  onEndChat?: (conv: Conversation) => void;
  onReopenChat?: (conv: Conversation) => void;
  onToggleFavorite?: (conv: Conversation) => void;
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
  onMarkAsRead,
  onMarkAsUnread,
  onEndChat,
  onReopenChat,
  onToggleFavorite,
}: ConversationListProps) => {
  const t = useTranslations("omnichannel");

  const statusFilters: StatusKey[] = ["all", "active", "waiting", "closed"];

  // Filter UI plumbing only — backend wiring lands once the API exposes
  // these params. Mock options stay until the service layer accepts them.
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const moreFiltersAppliedCount =
    (agentFilter !== "all" ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0) +
    (tagFilter !== "all" ? 1 : 0) +
    (dateRange?.from || dateRange?.to ? 1 : 0);

  const MOCK_AGENTS = [
    { value: "all", label: t("filters.allAgents") },
    { value: "unassigned", label: t("filters.unassigned") },
    { value: "agent-1", label: "Sara M." },
    { value: "agent-2", label: "Omar K." },
    { value: "agent-3", label: "Lina A." },
  ];

  const PRIORITIES: Array<{ value: string; label: string; tone: string }> = [
    {
      value: "all",
      label: t("filters.allPriorities"),
      tone: "text-gray-500",
    },
    { value: "urgent", label: t("priority.urgent"), tone: "text-red-500" },
    { value: "high", label: t("priority.high"), tone: "text-orange-500" },
    { value: "medium", label: t("priority.medium"), tone: "text-amber-500" },
    { value: "low", label: t("priority.low"), tone: "text-gray-400" },
  ];

  const MOCK_TAGS = [
    { value: "all", label: t("filters.allTags") },
    { value: "vip", label: "VIP" },
    { value: "support", label: "Support" },
    { value: "sales", label: "Sales" },
    { value: "billing", label: "Billing" },
    { value: "feedback", label: "Feedback" },
  ];

  const dateRangeLabel = (() => {
    if (!dateRange?.from && !dateRange?.to) return t("filters.anyDate");
    if (dateRange.from && dateRange.to)
      return `${format(dateRange.from, "d MMM")} – ${format(dateRange.to, "d MMM")}`;
    if (dateRange.from)
      return `${t("filters.from")} ${format(dateRange.from, "d MMM")}`;
    return `${t("filters.to")} ${format(dateRange.to!, "d MMM")}`;
  })();

  return (
    <div className="flex flex-col overflow-hidden h-full bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Search */}
      <div className="p-3.5 border-b border-gray-100 space-y-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative group flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-300 !text-[18px] transition-colors group-focus-within:text-primary-500" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              className="w-full h-10 ps-10 pe-4 bg-gray-50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowMoreFilters((v) => !v)}
            aria-pressed={showMoreFilters}
            aria-label={t("filters.toggle")}
            className={cn(
              "relative shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-xl border transition-colors",
              showMoreFilters || moreFiltersAppliedCount > 0
                ? "bg-primary-50 border-primary-200 text-primary-600"
                : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-primary-200 hover:text-primary-600",
            )}
          >
            <Tune className="!text-[18px]" />
            {moreFiltersAppliedCount > 0 && (
              <span className="absolute -top-1 -end-1 min-w-[16px] h-4 px-1 rounded-full bg-primary-500 text-white text-[9px] font-bold flex items-center justify-center">
                {moreFiltersAppliedCount}
              </span>
            )}
          </button>
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

        {/* Advanced filters — agent / priority / tags / date range. Hidden
            by default behind the Tune toggle next to the search bar so the
            sidebar stays compact; expanded view stacks each control as a
            full-width row so labels never get clipped and nothing scrolls
            horizontally. State is local until the API exposes these
            params. */}
        {showMoreFilters && (
          <div className="space-y-2 pt-1">
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger
                className={cn(
                  "w-full h-9 rounded-lg border bg-white text-[12px] font-medium",
                  agentFilter !== "all"
                    ? "border-primary-300 text-primary-700"
                    : "border-gray-200 text-gray-600",
                )}
              >
                <SelectValue placeholder={t("filters.agent")} />
              </SelectTrigger>
              <SelectContent>
                {MOCK_AGENTS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className={cn(
                  "w-full h-9 rounded-lg border bg-white text-[12px] font-medium",
                  priorityFilter !== "all"
                    ? "border-primary-300 text-primary-700"
                    : "border-gray-200 text-gray-600",
                )}
              >
                <SelectValue
                  placeholder={t("filters.priority")}
                />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <span className="inline-flex items-center gap-2">
                      <PriorityHigh className={cn("!text-[14px]", p.tone)} />
                      {p.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger
                className={cn(
                  "w-full h-9 rounded-lg border bg-white text-[12px] font-medium",
                  tagFilter !== "all"
                    ? "border-primary-300 text-primary-700"
                    : "border-gray-200 text-gray-600",
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <LocalOffer className="!text-[14px] text-gray-400" />
                  <SelectValue placeholder={t("filters.tags")} />
                </span>
              </SelectTrigger>
              <SelectContent>
                {MOCK_TAGS.map((tag) => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full inline-flex items-center justify-between gap-1 h-9 px-3 rounded-lg border bg-white text-[12px] font-medium",
                    dateRange?.from || dateRange?.to
                      ? "border-primary-300 text-primary-700"
                      : "border-gray-200 text-gray-600",
                  )}
                >
                  <span className="inline-flex items-center gap-2 truncate">
                    <CalendarMonth className="!text-[14px] text-gray-400" />
                    <span className="truncate">{dateRangeLabel}</span>
                  </span>
                  <KeyboardArrowDown className="!text-[14px] opacity-60 shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={1}
                />
                {(dateRange?.from || dateRange?.to) && (
                  <div className="p-2 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setDateRange(undefined)}
                      className="text-[11px] text-gray-500 hover:text-gray-700"
                    >
                      {t("filters.clearDate")}
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}
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
              onMarkAsRead={onMarkAsRead}
              onMarkAsUnread={onMarkAsUnread}
              onEndChat={onEndChat}
              onReopenChat={onReopenChat}
              onToggleFavorite={onToggleFavorite}
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
