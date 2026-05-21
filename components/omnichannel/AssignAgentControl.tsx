"use client";

import { useMemo, useRef, useState } from "react";
import { Person, Search, Check, Close, Add } from "@mui/icons-material";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "@/providers/TranslationProvider";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import usersService from "@/services/users.service";
import omnichannelService from "@/services/omnichannel.service";
import type { Assignee, Conversation } from "@/types/omnichannel";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Shape returned by /extension/list. Mirrors agents/(list)/columns.tsx — we
 * reuse the same endpoint so the org's user roster stays the single source
 * of truth for "who can take a chat". `email` is the identifier we store
 * in `conversation_assignees.agent_email`; it lines up with the email the
 * dashboard sends in the `User-Id` header from the agent's session. */
type UserRow = {
  id: string;
  name: string;
  email: string;
  ext?: string;
  status?: string;
};

type Props = {
  conversation: Conversation;
  /** Pushed up so the parent can update both the open thread and the
   * inbox row without waiting for the next poll tick. */
  onAssigned: (updated: Conversation) => void;
};

/** Hash an email to one of a few muted accent palettes so each agent gets
 * a stable chip color even though we don't persist one. Same trick the
 * tag chips use. */
const CHIP_PALETTES = [
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
  "bg-rose-50 text-rose-700 ring-rose-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-violet-50 text-violet-700 ring-violet-200",
] as const;
function paletteForEmail(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) >>> 0;
  }
  return CHIP_PALETTES[h % CHIP_PALETTES.length];
}

/**
 * Admin-only popover for managing the set of agents handling a
 * conversation. Multi-select: clicking an agent toggles them in/out of
 * the assignee list. Changes are persisted as a single PATCH with the
 * full desired list (replace-set semantics) so the network round-trip
 * stays in lockstep with the UI state.
 *
 * Lists every user in the org via usersService.getUsers() so the picker
 * stays in sync with the dashboard's Users page; we don't keep a separate
 * "assignable agents" registry on the omnichannel side.
 */
const AssignAgentControl = ({ conversation, onAssigned }: Props) => {
  const t = useTranslations("omnichannel");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: users, isLoading } = useLocalizedQuery<UserRow[]>({
    queryKey: ["org-users-assignable"],
    queryFn: usersService.getUsers,
    enabled: open,
  });

  const filtered = useMemo(() => {
    const rows = users ?? [];
    if (!query.trim()) return rows;
    const needle = query.trim().toLowerCase();
    return rows.filter(
      (u) =>
        u.name?.toLowerCase().includes(needle) ||
        u.email?.toLowerCase().includes(needle) ||
        u.ext?.toLowerCase().includes(needle),
    );
  }, [users, query]);

  const assignees = conversation.assignees ?? [];
  const assignedEmails = useMemo(
    () => new Set(assignees.map((a) => a.email.toLowerCase())),
    [assignees],
  );

  /** Sequence counter so out-of-order server responses don't clobber a
   * fresher optimistic state. Incremented on every persist; on response
   * we apply only if our seq still matches the latest issued one. */
  const reqSeq = useRef(0);

  /** Persist a new desired list — optimistic. Pushes the new assignees
   * to the parent immediately so the UI feels instant, then sends the
   * replace-set PATCH in the background. Reverts on error. */
  const persist = (next: Assignee[]) => {
    const prev = conversation;
    const myReq = ++reqSeq.current;
    // Optimistic — propagate up so the trigger pill, popover chips, and
    // chat header all update before the network round-trip completes.
    onAssigned({ ...conversation, assignees: next });
    omnichannelService
      .updateConversation(conversation.id, { assignees: next })
      .then((updated) => {
        if (reqSeq.current === myReq) onAssigned(updated);
      })
      .catch(() => {
        if (reqSeq.current === myReq) {
          onAssigned(prev);
          toast.error(t("assign.error") || "Failed to update assignment");
        }
      });
  };

  /** Add or remove the given agent from the current set. Idempotent — no
   * duplicate emails get inserted (case-insensitive). */
  const toggle = (u: UserRow) => {
    const email = u.email.toLowerCase();
    const exists = assignedEmails.has(email);
    const next: Assignee[] = exists
      ? assignees.filter((a) => a.email.toLowerCase() !== email)
      : [...assignees, { email: u.email, name: u.name }];
    persist(next);
  };

  const clearAll = () => persist([]);
  const removeOne = (email: string) =>
    persist(assignees.filter((a) => a.email.toLowerCase() !== email.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors max-w-[280px]",
            assignees.length > 0
              ? "bg-gray-50 text-gray-700 hover:bg-gray-100 ring-1 ring-inset ring-gray-200"
              : "border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700",
          )}
          aria-label={t("assign.label") || "Assign agents"}
        >
          {assignees.length === 0 ? (
            <>
              <Person className="!text-sm" />
              <span>{t("assign.assignTo") || "Assign"}</span>
            </>
          ) : (
            <>
              {/* Up to three avatar dots, then a "+N" overflow when more
                  agents are assigned. Keeps the header tidy. */}
              <span className="flex -space-x-1.5">
                {assignees.slice(0, 3).map((a) => (
                  <span
                    key={a.email}
                    title={a.name}
                    className={cn(
                      "w-5 h-5 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-semibold",
                      paletteForEmail(a.email),
                    )}
                  >
                    {a.name.slice(0, 1).toUpperCase()}
                  </span>
                ))}
              </span>
              <span className="truncate text-[11px] text-gray-700">
                {assignees.length === 1
                  ? assignees[0].name
                  : `${assignees.length} ${t("assign.assignees") || "agents"}`}
              </span>
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 p-0 overflow-hidden"
      >
        {/* Currently-assigned chips at the top so admins can remove
            individual agents with one click. */}
        {assignees.length > 0 && (
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                {t("assign.currentlyAssigned") || "Assigned"} (
                {assignees.length})
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-[11px] text-gray-400 hover:text-red-500"
              >
                {t("assign.clearAll") || "Clear all"}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {assignees.map((a) => (
                <span
                  key={a.email}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full ring-1 ring-inset px-2 py-0.5 text-[11px] font-medium",
                    paletteForEmail(a.email),
                  )}
                >
                  {a.name}
                  <button
                    type="button"
                    onClick={() => removeOne(a.email)}
                    className="opacity-70 hover:opacity-100"
                    aria-label={t("assign.remove") || "Remove"}
                  >
                    <Close className="!text-[12px]" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="px-3 py-2 border-b border-gray-100">
          <div className="relative">
            <Search className="!text-[16px] absolute start-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                t("assign.searchPlaceholder") || "Search agents..."
              }
              className="w-full ps-8 pe-2 py-1.5 text-xs bg-gray-50 rounded-md outline-none focus:bg-white focus:ring-1 focus:ring-primary-300"
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto py-1">
          {isLoading && (
            <div className="px-3 py-3 text-[11px] text-gray-400">
              {t("assign.loading") || "Loading…"}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="px-3 py-3 text-[11px] text-gray-400">
              {t("assign.empty") || "No agents found"}
            </div>
          )}

          {!isLoading &&
            filtered.map((u) => {
              const checked = assignedEmails.has(u.email.toLowerCase());
              return (
                <button
                  key={u.email || u.id}
                  type="button"
                  onClick={() => toggle(u)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-50 text-start",
                    checked && "bg-gray-50",
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
                        paletteForEmail(u.email || u.id),
                      )}
                    >
                      {u.name?.slice(0, 1).toUpperCase() || "?"}
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span className="truncate text-gray-800">{u.name}</span>
                      <span className="text-[10px] text-gray-400 truncate">
                        {u.email}
                      </span>
                    </span>
                  </span>
                  {checked ? (
                    <Check className="!text-[16px] text-primary-500 shrink-0" />
                  ) : (
                    <Add className="!text-[16px] text-gray-300 shrink-0" />
                  )}
                </button>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/** Read-only chips — what agents (non-admins) see in the header.
 * Mirrors the trigger pill so the chrome is visually consistent;
 * the only difference is non-interactive. */
export const AssignedAgentBadge = ({
  conversation,
}: {
  conversation: Conversation;
}) => {
  const assignees = conversation.assignees ?? [];
  if (assignees.length === 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 ring-1 ring-inset ring-gray-200 px-2.5 py-1 text-xs">
      <span className="flex -space-x-1.5">
        {assignees.slice(0, 3).map((a) => (
          <span
            key={a.email}
            title={a.name}
            className={cn(
              "w-5 h-5 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-semibold",
              paletteForEmail(a.email),
            )}
          >
            {a.name.slice(0, 1).toUpperCase()}
          </span>
        ))}
      </span>
      <span className="truncate text-[11px] text-gray-700">
        {assignees.length === 1
          ? assignees[0].name
          : `${assignees.length} agents`}
      </span>
    </div>
  );
};

export default AssignAgentControl;
